import "dotenv/config";
import { Handlers } from "./config";

import Server from "./server";

function checkEnvironmentValidity(): boolean {
  if (!process.env.APP_ID) {
    return false;
  }

  if (!process.env.PUBLIC_KEY) {
    return false;
  }

  if (!process.env.BOT_TOKEN) {
    return false;
  }

  return true;
}

if (!checkEnvironmentValidity()) {
  throw new Error("Environment is not configured!");
}

async function registerFunctions(server: Server) {
  const handlers = Handlers.ALL;
  for (let i = 0; i < handlers.length; i++) {
    await server.register(handlers[i]);
  }
}

async function run() {
  const server = new Server();
  await server.start();
  await registerFunctions(server);
}

run();
