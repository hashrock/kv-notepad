import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Memo, State, User } from "🛠️/types.ts";
import {
  getUserBySession,
  listImage,
  listMemo,
  listRecentlySignedInUsers,
} from "🛠️/db.ts";

import { Button, ButtonLink } from "🧱/Button.tsx";
import { Header } from "🧱/Header.tsx";
import { JSX } from "preact";

type Data = SignedInData | null;

interface SignedInData {
  user: User;
  users: User[];
  memos: Memo[];
  images: Image[];
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  if (!ctx.state.session) return ctx.render(null);

  const [user, users] = await Promise.all([
    getUserBySession(ctx.state.session),
    listRecentlySignedInUsers(),
  ]);
  if (!user) return ctx.render(null);

  const memos = await listMemo(user.id);
  const images = await listImage();

  return ctx.render({ user, users, memos, images });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>KV NotePad</title>
      </Head>
      <body class="bg-gray-100">
        <div class="px-4 py-8 mx-auto max-w-screen-md">
          <Header user={props.data?.user ?? null} />
          <div>
            <form action="/image" method="POST" encType="multipart/form-data">
              <input type="file" name="image" />
              <input
                type="submit"
                value="Upload"
              />
            </form>
          </div>

          <div>
            {props.data?.images.map((image) => {
              const data = image?.data;
              const type = image?.type;
              const blob = new Blob([data], { type });
              const base64 = btoa(
                String.fromCharCode(...new Uint8Array(data)),
              );
              const url = `data:${type};base64,${base64}`;
              return (
                <div>
                  <img
                    class="mt-8"
                    src={url}
                    alt={image?.name}
                    width="200"
                  />
                  <form action={`/image/${image.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <input type="submit" value="Delete" />
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      </body>
    </>
  );
}

function LinkButton(
  props: JSX.HTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <a
      {...props}
      class={`inline-block cursor-pointer px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 ${
        props.class ?? ""
      }`}
    />
  );
}

function SignedIn(props: SignedInData) {
  return (
    <>
      <div class="">
        <div class="mt-16 flex justify-end">
          <LinkButton href="/new">
            Create New
          </LinkButton>
        </div>
        <ul class="space-y-3 mt-8">
          {props.memos.map((memo) => {
            return (
              <li>
                <a
                  class="block bg-white py-6 px-8 shadow rounded hover:shadow-lg transition duration-200 border-l-8 border-gray-400"
                  href={`/memo/${memo?.id}`}
                >
                  <h2 class="text-lg">
                    {memo?.title}
                  </h2>

                  <p class="text-sm text-gray-500">
                    {memo?.body}
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
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
