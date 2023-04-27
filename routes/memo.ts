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
    const title = form.get("title")?.toString();
    if (!title) {
      return new Response("Bad Request", { status: 400 });
    }
    const body = form.get("body")?.toString();
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    console.log("title:", title);
    console.log("body:", body);

    await addMemo(u.id, title, body);

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
