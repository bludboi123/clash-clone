import { Client, Room } from "colyseus.js";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "ws://localhost:2567";

let client: Client | null = null;
let room: Room | null = null;

export function getClient(): Client {
  if (!client) client = new Client(SERVER_URL);
  return client;
}

export async function joinBattle(): Promise<Room> {
  const c = getClient();
  room = await c.joinOrCreate("battle");
  return room;
}

export function getRoom(): Room | null {
  return room;
}

export function deployCard(cardId: string, x: number, y: number) {
  room?.send("deploy", { cardId, x, y });
}
