import { spawn, SpawnOptions } from "child_process";
import { writefile } from "../utils";
import { kill, PID_PATH } from "./utils";

interface WrapOptions extends SpawnOptions {
  proxy?: boolean;
}

function wrap(
  executable: string
): (options?: WrapOptions, ...args: string[]) => Promise<number> {
  return (inputOptions?: WrapOptions, ...args: string[]): Promise<number> => {
    const options = Object.assign({ proxy: true }, inputOptions);

    const proc = spawn(executable, args, options);

    if (options.detached) {
      proc.unref();
    }

    if (options.proxy) {
      proc.stdout.on("data", process.stdout.write);
      proc.stderr.on("data", process.stderr.write);
    }

    return options.detached
      ? Promise.resolve(proc.pid)
      : new Promise((resolve, reject) => {
          proc.on("exit", (code) => {
            if (code) {
              reject(code);
            } else {
              resolve(code);
            }
          });
        });
  };
}

const yarn = wrap("yarn");

async function restart() {
  await kill();

  const pid = await yarn(
    { detached: true, proxy: false, stdio: ["ignore", "ignore", "ignore"] },
    "start"
  );
  await writefile(PID_PATH, pid.toString(10), {});
}

restart();
