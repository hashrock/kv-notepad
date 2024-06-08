import { JSX } from "preact";

const buttonClasses =
  "px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return <button {...props} class={`${buttonClasses} ${props.class || ""}`} />;
}

export function ButtonLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} class={`${buttonClasses} ${props.class || ""}`} />;
}
