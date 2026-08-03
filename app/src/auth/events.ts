import type { CreateUser, User, SafeUser } from "bknd";
import { Event } from "core/events";
 
export class AuthBeforeLogin extends Event<{ user: User }> {
   static override slug = "auth-before-login";
}
export class AuthAfterLogin extends Event<{ user: User }> {
   static override slug = "auth-after-login";
}
export class AuthBeforeRegister extends Event<{ user: CreateUser }> {
   static override slug = "auth-before-register";
}
export class AuthAfterRegister extends Event<{ user: User }> {
   static override slug = "auth-after-register";
}
export class AuthBeforePasswordChange extends Event<{ user: User }> {
   static override slug = "auth-before-password-change";
}
export class AuthAfterPasswordChange extends Event<{ user: User }> {
   static override slug = "auth-after-password-change";
}
export class AuthBeforeLogout extends Event<{ user: SafeUser | undefined }> {
   static override slug = "auth-before-logout";
}
export class AuthAfterLogout extends Event<{ user: SafeUser | undefined }> {
   static override slug = "auth-after-logout";
}
// export class AuthBeforeVerification extends Event<{ user: User }> {
//    static override slug = "auth-before-verification";
// }
// export class AuthAfterVerification extends Event<{ user: User }> {
//    static override slug = "auth-after-verification";
// }
// export class AuthBeforePasswordReset extends Event<{}> {
//    static override slug = "auth-before-password-reset";
// }
// export class AuthAfterPasswordReset extends Event<{}> {
//    static override slug = "auth-after-password-reset";
// }

export const AuthEvents = {
   AuthBeforeLogin,
   AuthAfterLogin,
   AuthBeforeRegister,
   AuthAfterRegister,
   AuthAfterPasswordChange,
   AuthBeforePasswordChange,
   AuthBeforeLogout,
   AuthAfterLogout,
   // AuthAfterVerification,
   // AuthBeforeVerification,
   // AuthBeforePasswordReset,
   // AuthAfterPasswordReset,
};