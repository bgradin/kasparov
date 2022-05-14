import path from "path";
import { appendfile } from "./utils";

export const ERROR_LOG_PATH = path.join(process.cwd(), "error.log");

function getTimestamp() {
  const pad = (n, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
  const d = new Date();

  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function error(err: Error) {
  await appendfile(
    ERROR_LOG_PATH,
    `${getTimestamp} -- ${err.message}\n${err.stack}`
  );
}

export default {
  error,
};
