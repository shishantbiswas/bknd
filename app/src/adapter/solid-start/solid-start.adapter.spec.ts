import { afterAll, beforeAll, describe } from "bun:test";
import * as solidStart from "./solid-start.adapter";
import { disableConsoleLog, enableConsoleLog } from "core/utils";
import { adapterTestSuite } from "adapter/adapter-test-suite";
import { bunTestRunner } from "adapter/bun/test";
import type { SolidStartUserbaseConfig } from "./solid-start.adapter";

beforeAll(disableConsoleLog);
afterAll(enableConsoleLog);

describe("solid-start adapter", () => {
   adapterTestSuite<SolidStartUserbaseConfig>(bunTestRunner, {
      makeApp: solidStart.getApp,
      makeHandler: solidStart.serve,
   });
});
