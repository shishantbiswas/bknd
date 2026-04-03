import { afterAll, beforeAll, describe } from "bun:test";
import * as meta from "./meta.adapter";
import { disableConsoleLog, enableConsoleLog } from "core/utils";
import { adapterTestSuite } from "adapter/adapter-test-suite";
import { bunTestRunner } from "adapter/bun/test";
import type { MetaFrameworkConfig, MetaRuntimeConfig } from "./meta.adapter";

beforeAll(disableConsoleLog);
afterAll(enableConsoleLog);

describe("meta framework adapter", () => {
   adapterTestSuite<MetaFrameworkConfig>(bunTestRunner, {
      makeApp: meta.getFrameworkApp,
      makeHandler: meta.serveFramework,
   });
});

describe("meta runtime adapter", () => {
   adapterTestSuite<MetaRuntimeConfig>(bunTestRunner, {
      makeApp: meta.getRuntimeApp,
      makeHandler: meta.serveRuntime,
   });
});
