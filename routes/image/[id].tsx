import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import {
  deleteImage,
  deleteMemo,
  getMemo,
  getUserBySession,
  updateMemo,
} from "🛠️/db.ts";
import { Memo, State, User } from "🛠️/types.ts";

async function remove(
  id: string,
) {
  await deleteImage(id);
  return redirect("/image");
}

export const handler: Handlers<undefined, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const method = form.get("_method")?.toString();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (method === "DELETE") {
      return remove(ctx.params.id);
    }

    return new Response("Bad Request", { status: 400 });
  },
};

function redirect(location = "/") {
  const headers = new Headers();
  headers.set("location", location);
  return new Response(null, {
    status: 303,
    headers,
  });
}
