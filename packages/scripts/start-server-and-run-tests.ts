import { execa } from "execa";
import originalTerminate, { TerminateOptions } from "terminate";
import util from "util";
import waitOn from "wait-on";

/**
 * Couldn't import promise version of terminate(...) so I just copied the promise
 * version since it's just a wrapper around the callback version.
 *
 * Copied from `node_modules/terminate/promise.d.ts`.
 */
function terminate(pid: number): Promise<void>;
function terminate(
  pid: number,
  signal?: string,
  opts?: TerminateOptions,
): Promise<void>;
function terminate(
  pid: number,
  signal: string,
  opts?: TerminateOptions,
): Promise<void>;
function terminate(pid: number, opts: TerminateOptions): Promise<void>;
function terminate() {
  return util.promisify(originalTerminate).apply(null, arguments as any);
}

(async () => {
  // start medusa server

  const medusa = execa("medusa", ["start"], {
    cwd: "packages/medusa",
    stdio: "inherit",
    timeout: 60 * 1000,
  });

  // wait for API to be ready

  try {
    await waitOn({
      resources: ["http://localhost:9000/store/regions"],
      timeout: 60 * 1000,
    });
  } catch (err) {
    medusa.pid && (await terminate(medusa.pid, "SIGKILL"));
    throw err;
  }

  // run tests

  const tests = await execa("yarn", ["run", "test"], {
    cwd: "tests",
    stdio: "inherit",
    timeout: 60 * 1000,
  });

  medusa.pid && (await terminate(medusa.pid, "SIGKILL"));
  process.exit(tests.exitCode);
})();
