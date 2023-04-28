import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";

import { Header } from "🧱/Header.tsx";

interface Data {
  user: User | null;
}
export const handler: Handlers<Data, State> = {
  async GET(_, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    return ctx.render({ user });
  },
};

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
