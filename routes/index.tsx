import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Memo, State, User } from "🛠️/types.ts";
import { getUserBySession, listMemo, listRecentlySignedInUsers } from "🛠️/db.ts";

import { Button, ButtonLink } from "🧱/Button.tsx";
import { Header } from "🧱/Header.tsx";

type Data = SignedInData | null;

interface SignedInData {
  user: User;
  users: User[];
  memos: Memo[];
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  if (!ctx.state.session) return ctx.render(null);

  const [user, users] = await Promise.all([
    getUserBySession(ctx.state.session),
    listRecentlySignedInUsers(),
  ]);
  if (!user) return ctx.render(null);

  const memos = await listMemo(user.id);

  return ctx.render({ user, users, memos });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>KV Memo</title>
      </Head>
      <div class="px-4 py-8 mx-auto max-w-screen-md">
        <Header user={props.data?.user ?? null} />
        {props.data ? <SignedIn {...props.data} /> : <SignedOut />}
      </div>
    </>
  );
}

function SignedIn(props: SignedInData) {
  return (
    <>
      <h1>Memos</h1>

      <ul class="my-6">
        {props.memos.map((memo) => {
          return (
            <li>
              <a href={`/memo/${memo?.id}`}>{memo?.title}</a>
            </li>
          );
        })}
      </ul>

      <div>
        <form action="/api/memo" method="POST">
          <input type="text" name="title" class="border py-3 px-4" />
          <input type="text" name="body" class="border py-3 px-4" />
          <input type="submit" class="mt-4" />
        </form>
      </div>
    </>
  );
}

function SignedOut() {
  return (
    <>
      <p class="my-6">
        <ButtonLink href="/auth/signin">
          Log in with GitHub
        </ButtonLink>
      </p>
    </>
  );
}
