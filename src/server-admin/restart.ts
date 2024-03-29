import { spawn, SpawnOptions } from "child_process";
import { writefile } from "../utils";
import { kill, PID_PATH } from "./utils";

interface WrapOptions extends SpawnOptions {
  proxy?: boolean;
}

function wrap(
  executable: string
): (options?: WrapOptions, ...args: string[]) => Promise<number | undefined> {
  return (
    inputOptions?: WrapOptions,
    ...args: string[]
  ): Promise<number | undefined> => {
    const options = Object.assign({ proxy: true }, inputOptions);

    const proc = spawn(executable, args, options);
    if (!proc.pid) {
      throw new Error("Process spawn failed!");
    }

    if (options.detached) {
      proc.unref();
    }

    if (options.proxy && proc.stdout && proc.stderr) {
      proc.stdout.on("data", process.stdout.write);
      proc.stderr.on("data", process.stderr.write);
    }

    return options.detached
      ? Promise.resolve(proc.pid)
      : new Promise((resolve, reject) => {
          proc.on("exit", (code) => {
            if (code) {
              reject();
            } else {
              resolve(undefined);
            }
          });
        });
  };
}

async function restart() {
  await kill();

  const pid = await wrap("node")(
    { detached: true, proxy: false, stdio: ["ignore", "ignore", "ignore"] },
    "--nolazy",
    "-r",
    "ts-node/register/transpile-only",
    "src/main.ts"
  );
  if (pid) {
    await writefile(PID_PATH, pid.toString(10), {});
  }
}

restart();
