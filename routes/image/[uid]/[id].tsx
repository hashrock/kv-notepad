import { Handlers } from "$fresh/server.ts";
import { deleteImage, getImage, getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";

async function remove(
  uid: string,
  id: string,
) {
  await deleteImage(uid, id);
  return redirect("/image");
}

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    // No auth
    const image = await getImage(ctx.params.uid, ctx.params.id);
    if (image === null) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response(image.body, {
      headers: {
        "content-type": image.meta?.type ?? "application/octet-stream",
      },
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const method = form.get("_method")?.toString();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (user.id !== ctx.params.uid) {
      return new Response("Forbidden", { status: 403 });
    }
    if (method === "DELETE") {
      return remove(ctx.params.uid, ctx.params.id);
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
