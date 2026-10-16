# Clash Clone

A small Clash Royale–style real-time strategy game: deploy troops from a
rotating hand of cards, spend elixir, push lanes, and knock down the
opponent's towers before time runs out. Built as a learning/portfolio
project — an original card set and an original, simplified combat model,
not a copy of any shipped game's assets or data.

## Stack

- **Shared** (`shared/`): card definitions, arena constants, and TypeScript
  types used by both client and server, so the simulation rules live in
  exactly one place.
- **Server** (`server/`): [Colyseus](https://colyseus.io) room running a
  server-authoritative simulation at 20 ticks/sec — elixir regen, card
  deploy validation, unit movement/targeting/combat, tower damage, win
  conditions. Clients never decide outcomes; they just send "deploy this
  card here" and render whatever state the server broadcasts.
- **Client** (`client/`): [Phaser 3](https://phaser.io) + [Vite](https://vitejs.dev),
  connected via `colyseus.js`. A lobby screen to find a match, then a
  battle screen with the arena, live tower/unit rendering, an elixir bar,
  and a 4-card hand you click to select then click the arena to deploy.

## Project layout

```
clash-clone/
├─ shared/   @clash-clone/shared   — types, card data, constants
├─ server/   @clash-clone/server   — Colyseus game server
└─ client/   @clash-clone/client   — Phaser game client
```

## Running it locally

Requires Node 18+.

```bash
# from the repo root
npm install          # installs all three workspaces
npm run build         # builds shared (server/client import its compiled output)

# two terminals:
npm run dev:server    # starts the Colyseus server on :2567
npm run dev:client    # starts the Vite dev server, usually on :5173
```

Open the client URL in two browser tabs (or two browsers) to play against
yourself locally — the server matches the first two connections into a
room together.

Copy `client/.env.example` to `client/.env` if you need to point the
client at a server that isn't `ws://localhost:2567`.

## How a match works

1. Each player opens with a shuffled 8-card deck; 4 cards show in hand, a
   5th is the "next" preview — classic cycle, not a random draw each time.
2. Elixir regenerates automatically up to a cap of 10, doubling in speed
   for the last minute of the match (overtime included).
3. Dropping a card costs its elixir and is only legal on your own half of
   the arena, until the enemy's tower on that lane has fallen — then you
   can push across.
4. Units path toward the nearest enemy unit in aggro range, or the
   nearest standing tower otherwise, and auto-attack once in range.
5. Destroying both princess towers' king tower, or having fewer towers
   lost when the clock runs out, wins the match. Equal towers lost at
   time-out triggers a 1-minute overtime (sudden death on the next tower).

## Extending it

- `shared/src/cards.ts` is the whole card pool — add a new entry and it's
  immediately deployable (no other file needs touching for a simple
  stat-based troop).
- Combat in `server/src/rooms/BattleRoom.ts` uses direct-line movement
  rather than real lane pathing; swapping in a flow-field or waypoint
  system per lane is the natural next upgrade for more realistic pushes.
- The client renders units/towers as plain shapes with text labels —
  swapping in sprite sheets is just a matter of replacing the `add.circle`
  / `add.rectangle` calls in `BattleScene.ts` with `add.sprite`.

## Status / known gaps

This is a first playable slice, not a full clone:

- No persistence — no accounts, ranking, or deck building across matches.
- No spectator/reconnect handling beyond a simple forfeit-on-disconnect.
- Only two troop-targeting rules (ground/air/both); no building-only
  targeting (e.g. a "Giant" that should path past troops to a building).
- Pathing is straight-line, so units don't route around the river except
  by happening to approach a bridge-adjacent tower.

PRs / issues welcome if you pick this up and extend it.
