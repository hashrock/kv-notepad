import { Handlers } from "$fresh/server.ts";
import { addMemo, getUserBySession, listMemo } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";

export const handler: Handlers<undefined, State> = {
  async POST(req, ctx) {
    const u = await getUserBySession(ctx.state.session ?? "");
    if (u === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    const form = await req.formData();
    const body = form.get("body")?.toString();
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    await addMemo(u.id, body);

    //    return new Response("OK", { status: 200 });
    //redirect /
    const headers = new Headers();
    headers.set("location", "/");
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};
