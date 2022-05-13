import fs from "fs";
import path from "path";
import { readfile, rm } from "../utils";

export const PID_PATH = path.join(process.cwd(), ".pid");

export async function kill() {
  if (fs.existsSync(PID_PATH)) {
    const latentPid = parseInt((await readfile(PID_PATH)).toString("utf8"), 10);
    try {
      process.kill(latentPid);
    } catch (err) {
    } finally {
      await rm(PID_PATH);
    }
  }
}
