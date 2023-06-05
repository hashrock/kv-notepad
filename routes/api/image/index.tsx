import { Handlers } from "$fresh/server.ts";
import { addImage, getUserBySession } from "🛠️/db.ts";
import { Image, State, User } from "🛠️/types.ts";
import { listImage } from "🛠️/db.ts";
interface SignedInData {
  user: User;
  images: Image[];
}

export const handler: Handlers<SignedInData, State> = {
  async POST(req, ctx) {
    const form = await req.formData();

    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const file = form.get("image") as File | null;

    if (!file) {
      return new Response("Bad Request", { status: 400 });
    }
    const reader = file.stream().getReader();
    const result = await reader.read();
    const bytes = result.value;
    if (!bytes) {
      return new Response("Bad Request", { status: 400 });
    }

    const filetype = file.type;
    const ext = filetype.split("/")[1];

    const success = await addImage(user.id, file);

    return success.result.ok
      ? new Response(
        JSON.stringify(`/api/image/${user.id}/${success.id}.${ext}`),
      )
      : new Response("Internal Server Error", { status: 500 });
  },
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return new Response("Unauthorized", { status: 401 });

    const images = await listImage(user.id);
    return new Response(JSON.stringify(images));
  },
};
