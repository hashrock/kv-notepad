import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import {
  addMemo,
  deleteMemo,
  getMemo,
  getUserBySession,
  updateMemo,
} from "🛠️/db.ts";
import { Memo, State, User } from "🛠️/types.ts";

import { Header } from "🧱/Header.tsx";

async function put(user: User, id: string, form: FormData) {
  if (!id) {
    return new Response("Bad Request", { status: 400 });
  }
  const title = form.get("title")?.toString();
  if (!title) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = form.get("body")?.toString();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }

  await updateMemo(user.id, id, title, body);

  return redirect();
}

async function remove(
  user: User,
  id: string,
) {
  await deleteMemo(user.id, id);
  return redirect();
}

interface Data {
  user: User | null;
}
export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    return ctx.render({ user });
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

export default function Home(props: PageProps<Data>) {
  const { user } = props.data;
  const yyyymmdd = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Head>
        <title>
          New | KvMemo
        </title>
      </Head>
      <div class="px-4 py-8 mx-auto max-w-screen-md">
        <Header user={user} />

        <form action={`/memo`} method="POST">
          <div>
            <input type="text" name="title" value={yyyymmdd} />
          </div>
          <div>
            <textarea name="body" id="" cols={50} rows={20}></textarea>
          </div>
          <input type="submit" />
        </form>
      </div>
    </>
  );
}
