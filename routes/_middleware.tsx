import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { State } from "🛠️/types.ts";
import { getSessionId } from "kv_oauth";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const url = new URL(req.url);
  if (url.pathname === "") return await ctx.next();
  ctx.state.session = getSessionId(req);
  const resp = await ctx.next();
  return resp;
}
