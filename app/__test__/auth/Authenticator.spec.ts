import { Authenticator } from "auth/authenticate/Authenticator";
import { EventManager } from "core/events";
import { describe, expect, test, mock, beforeAll, afterAll } from "bun:test";
import type { Context } from "hono";
import type { AuthStrategy } from "index";
import { disableConsoleLog, enableConsoleLog } from "core/utils/test";

beforeAll(disableConsoleLog);
afterAll(enableConsoleLog);

describe("Authenticator", async () => {
   const user = {
      id: 1,
      email: "test@example.com",
      strategy: "password",
      strategy_value: "hash",
   };
   const userPool = {
      findBy: async () => user,
      create: async () => user,
   };

   test("should return auth cookie headers", async () => {
      const auth = new Authenticator({}, userPool, {
         jwt: {
            secret: "secret",
            fields: [],
         },
         cookie: {
            sameSite: "strict",
         },
      });
      const headers = await auth.getAuthCookieHeader("token");
      const cookie = headers.get("Set-Cookie");
      expect(cookie).toStartWith("auth=");
      expect(cookie).toEndWith("HttpOnly; Secure; SameSite=Strict");

      // now expect it to be removed
      const headers2 = await auth.removeAuthCookieHeader(headers);
      const cookie2 = headers2.get("Set-Cookie");
      expect(cookie2).toStartWith("auth=; Max-Age=0; Path=/; Expires=");
      expect(cookie2).toEndWith("HttpOnly; Secure; SameSite=Strict");
   });

   test("should return auth cookie string", async () => {
      const auth = new Authenticator({}, null as any, {
         jwt: {
            secret: "secret",
            fields: [],
         },
         cookie: {
            sameSite: "strict",
         },
      });
      const cookie = await auth.unsafeGetAuthCookie("token");
      expect(cookie).toStartWith("auth=");
      expect(cookie).toEndWith("HttpOnly; Secure; SameSite=Strict");
   });

   test("bearer token is case insensitive", async () => {
      const auth = new Authenticator({}, null as any, {
         jwt: {
            secret: "secret",
            fields: ["sub"],
         },
         cookie: {
            sameSite: "strict",
         },
      });
      const token = await auth.jwt({ sub: "test" });

      const res = await auth.resolveAuthFromRequest(new Headers({
         Authorization: `Bearer ${token}`,
      }));
      expect((res as any).sub).toBe("test")

      const res2 = await auth.resolveAuthFromRequest(new Headers({
         Authorization: `bearer ${token}`,
      }));
      expect((res2 as any).sub).toBe("test")
   });

   test("emits auth login events", async () => {
      const emgr = new EventManager(Authenticator.Events);

      const auth = new Authenticator(
         {},
         userPool,
         {
            jwt: {
               secret: "secret",
               fields: ["id", "email"],
            },
            cookie: {
               sameSite: "strict",
            },
         },
         emgr,
      );

      const called = mock(() => null);

      auth.emgr.onEvent(Authenticator.Events.AuthBeforeLogin, () => {
         called();
      });
      auth.emgr.onEvent(Authenticator.Events.AuthAfterLogin, () => {
         called();
      });

      const context = {
         req: {
            url: "http://localhost/",
            header: () => undefined,
         },
         header: (name: string, value?: string) => {
            if (value === undefined) {
               return undefined;
            }
            return { name, value };
         },
         set: () => undefined,
         json: (payload: unknown) => payload,
         redirect: (url: string) => url,
      } as unknown as Context;

      await auth.resolveLogin(
         context,
         {
            getName: () => "password",
         } as any as AuthStrategy,
         { email: "test@bknd.com" },
         async () => {},
      );
      await auth.emgr.executeAsyncs();

      expect(called).toHaveBeenCalledTimes(2);
   });

   test("emits auth register events", async () => {
      const emgr = new EventManager(Authenticator.Events);

      const auth = new Authenticator(
         {},
         userPool,
         {
            jwt: {
               secret: "secret",
               fields: ["id", "email"],
            },
            cookie: {
               sameSite: "strict",
            },
         },
         emgr,
      );

      const called = mock(() => null);

      const context = {
         req: {
            url: "http://localhost/",
            header: () => undefined,
         },
         header: (name: string, value?: string) => {
            if (value === undefined) {
               return undefined;
            }
            return { name, value };
         },
         set: () => undefined,
         json: (payload: unknown) => payload,
         redirect: (url: string) => url,
      } as unknown as Context;

      auth.emgr.onEvent(Authenticator.Events.AuthBeforeRegister, () => {
         called();
      });
      auth.emgr.onEvent(Authenticator.Events.AuthAfterRegister, () => {
         called();
      });

      await auth.resolveRegister(
         context,
         {
            getName: () => "password",
         } as any as AuthStrategy,
         { email: "test@bknd.com", strategy_value: "supersecretpassword" },
         async () => {},
      );
      await auth.emgr.executeAsyncs();

      expect(called).toHaveBeenCalledTimes(2);
   });

   test("emits auth logout events", async () => {
      const emgr = new EventManager(Authenticator.Events);
      const auth = new Authenticator(
         {},
         userPool,
         {
            jwt: {
               secret: "secret",
               fields: ["id", "email"],
            },
            cookie: {
               sameSite: "strict",
            },
         },
         emgr,
      );

      const called = mock(() => null);
      const authState: Record<string, any> = { auth: { user } };

      auth.emgr.onEvent(Authenticator.Events.AuthBeforeLogout, () => {
         called();
      });
      auth.emgr.onEvent(Authenticator.Events.AuthAfterLogout, () => {
         called();
      });

      const headers = new Headers();
      const context = {
         req: {
            url: "http://localhost/",
            header: (_name: string) => undefined,
            raw: {
               headers,
            },
         },
         header: (name: string, value?: string) => {
            if (value === undefined) {
               return undefined;
            }
            headers.set(name, value);
            return { name, value };
         },
         get: (key: string) => authState[key],
         set: (key: string, value: any) => {
            authState[key] = value;
         },
      } as unknown as Context;

      await auth.logout(context);
      await auth.emgr.executeAsyncs();

      expect(called).toHaveBeenCalledTimes(2);
      expect(authState.auth).toBeUndefined();
      expect(auth.emgr.eventExists("auth-before-logout")).toBe(true);
      expect(auth.emgr.eventExists("auth-after-logout")).toBe(true);
   });

   test("emits auth password change events", async () => {
      const auth = new Authenticator({}, userPool, {
         jwt: {
            secret: "secret",
            fields: ["id", "email"],
         },
         cookie: {
            sameSite: "strict",
         },
      });

      const called = mock(() => null);

      auth.emgr.onEvent(Authenticator.Events.AuthBeforePasswordChange, () => void called());
      auth.emgr.onEvent(Authenticator.Events.AuthAfterPasswordChange, () => void called());

      await auth.emgr.emit(new Authenticator.Events.AuthBeforePasswordChange({ user }));
      await auth.emgr.emit(new Authenticator.Events.AuthAfterPasswordChange({ user }));
      await auth.emgr.executeAsyncs();

      expect(auth.emgr.eventExists("auth-before-password-change")).toBe(true);
      expect(auth.emgr.eventExists("auth-after-password-change")).toBe(true);

      expect(called).toHaveBeenCalledTimes(2);
   });
});
