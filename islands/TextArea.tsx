import { useEffect, useRef, useState } from "preact/hooks";

export default function TextArea() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [dropOver, setDropOver] = useState(false);
  useEffect(() => {
    ref.current?.addEventListener("dragover", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(true);
    }, false);

    ref.current?.addEventListener("dragleave", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(false);
    }, false);

    ref.current?.addEventListener("drop", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(false);
      const files = e.dataTransfer?.files;

      const formData = new FormData();
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          formData.append("image", file);
        }
      }
      (async () => {
        const res = await fetch(`/api/image`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const url = await res.json();
        const markdown = `![Image](${url})`;

        const textarea = document.querySelector("textarea");
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const before = text.slice(0, start);
          const after = text.slice(end);
          textarea.value = before + markdown + after;
          textarea.selectionStart = textarea.selectionEnd = start + url.length;
        }
      })();
    }, false);
  }, []);

  return (
    <div class="flex relative">
      <textarea
        ref={ref}
        name="body"
        class={`px-3 py-2 h-[32rem] w-full border-1 rounded ${
          dropOver ? "border-2 border-blue-500" : ""
        }`}
      />
    </div>
  );
}
