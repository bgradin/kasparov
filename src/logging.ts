import path from "path";
import { appendfile } from "./utils";

export const ERROR_LOG_PATH = path.join(process.cwd(), "error.log");

async function error(err: Error) {
  await appendfile(ERROR_LOG_PATH, `Exception: ${err.message}\n${err.stack}`);
}

export default {
  error,
};
