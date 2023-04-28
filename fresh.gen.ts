// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_middleware.tsx";
import * as $1 from "./routes/api/memo.ts";
import * as $2 from "./routes/auth/oauth2callback.ts";
import * as $3 from "./routes/auth/signin.ts";
import * as $4 from "./routes/auth/signout.ts";
import * as $5 from "./routes/index.tsx";
import * as $6 from "./routes/memo/[id].tsx";

const manifest = {
  routes: {
    "./routes/_middleware.tsx": $0,
    "./routes/api/memo.ts": $1,
    "./routes/auth/oauth2callback.ts": $2,
    "./routes/auth/signin.ts": $3,
    "./routes/auth/signout.ts": $4,
    "./routes/index.tsx": $5,
    "./routes/memo/[id].tsx": $6,
  },
  islands: {},
  baseUrl: import.meta.url,
  config,
};

export default manifest;
