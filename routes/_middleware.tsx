import { FreshContext } from "$fresh/server.ts";
import { State } from "🛠️/types.ts";
import { getSessionId } from "jsr:@deno/kv-oauth";

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const url = new URL(req.url);
  if (url.pathname === "") return await ctx.next();
  ctx.state.session = await getSessionId(req);
  const resp = await ctx.next();
  return resp;
}
