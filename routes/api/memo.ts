// import { HandlerContext, Handlers } from "$fresh/server.ts";
// import { addMemo, getUserBySession, updateMemo, deleteMemo } from "🛠️/db.ts";
// import { State } from "🛠️/types.ts";

// async function put(req: Request, ctx: HandlerContext<undefined, State>) {
//   const u = await getUserBySession(ctx.state.session ?? "");
//   if (u === null) {
//     return new Response("Unauthorized", { status: 401 });
//   }
//   const form = await req.formData();
//   const id = form.get("id")?.toString();
//   if (!id) {
//     return new Response("Bad Request", { status: 400 });
//   }
//   const title = form.get("title")?.toString();
//   if (!title) {
//     return new Response("Bad Request", { status: 400 });
//   }
//   const body = form.get("body")?.toString();
//   if (!body) {
//     return new Response("Bad Request", { status: 400 });
//   }

//   await updateMemo(u.id, id, title, body);

//   const headers = new Headers();
//   headers.set("location", "/");
//   return new Response(null, {
//     status: 303, // See Other
//     headers,
//   });
// }

// async function remove(req: Request, ctx: HandlerContext<undefined, State>) {
//   const user = await getUserBySession(ctx.state.session ?? "");
//   if (user === null) {
//     return new Response("Unauthorized", { status: 401 });
//   }
//   if (!id) {
//     return new Response("Bad Request", { status: 400 });
//   }
//   await deleteMemo(user.id, id);
//   const headers = new Headers();
//   headers.set("location", "/");
//   return new Response(null, {
//     status: 303, // See Other
//     headers,
//   });
// }

// export const handler: Handlers<undefined, State> = {
//   async POST(req, ctx) {
//     const form = await req.formData();
//     const method = form.get("_method")?.toString();

//     if (method === "PUT") {
//       return put(req, ctx);
//     }
//     if (method === "DELETE") {
//       return remove(req, ctx);
//     }

//     const user = await getUserBySession(ctx.state.session ?? "");
//     if (user === null) {
//       return new Response("Unauthorized", { status: 401 });
//     }
//     const title = form.get("title")?.toString();
//     if (!title) {
//       return new Response("Bad Request", { status: 400 });
//     }
//     const body = form.get("body")?.toString();
//     if (!body) {
//       return new Response("Bad Request", { status: 400 });
//     }

//     await addMemo(user.id, title, body);

//     const headers = new Headers();
//     headers.set("location", "/");
//     return new Response(null, {
//       status: 303,
//       headers,
//     });
//   },
// };
