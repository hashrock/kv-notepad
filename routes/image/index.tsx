import { Handlers } from "$fresh/server.ts";
import { addImage, addMemo, getUserBySession } from "🛠️/db.ts";
import { Memo, State, User } from "🛠️/types.ts";

interface Data {
  memo: Memo;
  user: User | null;
}
export const handler: Handlers<Data, State> = {
  async POST(req, ctx) {
    const form = await req.formData();

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

    addImage("myimage", file);

    console.log(
      file.name,
      file.type,
      file.size,
      file.lastModified,
      file.stream,
      file.text,
      file.arrayBuffer,
      file.slice,
      file.arrayBuffer,
    );

    return redirect("/image");
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
