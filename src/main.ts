import "dotenv/config";

import GameFunction from "./functions/game";
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

async function registerFunctions() {
  await server.register(new GameFunction());
}

const server = new Server();
server.start();
