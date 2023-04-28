import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Memo, State, User } from "🛠️/types.ts";
import { getMemo, getUserBySession } from "🛠️/db.ts";

import { Header } from "🧱/Header.tsx";

interface Data {
  memo: Memo;
  user: User | null;
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  const user = await getUserBySession(ctx.state.session ?? "");
  if (!user) return ctx.renderNotFound();
  const memo = await getMemo(user.id, ctx.params.id);
  if (!memo) return ctx.renderNotFound();

  return ctx.render({ memo, user });
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

        <form action="/api/memo" method="POST">
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
      </div>
    </>
  );
}
