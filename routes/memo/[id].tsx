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
  memo: Memo;
  user: User | null;
}
export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    const memo = await getMemo(user.id, ctx.params.id);
    if (!memo) return ctx.renderNotFound();

    return ctx.render({ memo, user });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const method = form.get("_method")?.toString();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (method === "PUT") {
      return put(user, ctx.params.id, form);
    }
    if (method === "DELETE") {
      return remove(user, ctx.params.id);
    }

    const title = form.get("title")?.toString();
    if (!title) {
      return new Response("Bad Request", { status: 400 });
    }
    const body = form.get("body")?.toString();
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    await addMemo(user.id, title, body);

    return redirect();
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
  const { memo, user } = props.data;
  return (
    <>
      <Head>
        <title>
          {memo.title} | KvMemo
        </title>
      </Head>
      <div class="px-4 py-8 mx-auto max-w-screen-md">
        <Header user={user} />

        <h1>{memo.id}</h1>

        <form action={`/memo/${memo.id}`} method="POST">
          <div>
            <input type="text" name="title" value={memo.title} />
          </div>
          <div>
            <textarea name="body" id="" cols={50} rows={20}>
              {memo.body}
            </textarea>
          </div>
          <input type="hidden" name="_method" value="PUT" />
          <input type="hidden" value={memo.id} />
          <input type="submit" />
        </form>

        <form action={`/memo/${memo.id}`} method="POST">
          <input type="hidden" name="_method" value="DELETE" />
          <input type="hidden" value={memo.id} />
          <input type="submit" value="Delete" />
        </form>
      </div>
    </>
  );
}
