import type { UserbaseConfig } from "adapter";
import type { Command } from "commander";

export type CliCommand = (program: Command) => void;

export type CliUserbaseConfig<Env = any> = UserbaseConfig & {
   server?: {
      port?: number;
      platform?: "node" | "bun";
   };
};
