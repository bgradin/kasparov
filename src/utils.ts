import fetch, { RequestInit } from "node-fetch";
import { verifyKey } from "discord-interactions";

export function verifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function makeDiscordRequest(
  endpoint: string,
  options: RequestInit
) {
  const url = "https://discord.com/api/v9/" + endpoint;

  const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json; charset=UTF-8",
  };

  const res = await fetch(url, {
    headers: options.headers
      ? Object.assign(options.headers, headers)
      : headers,
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(JSON.stringify(data));
  }

  return res;
}
