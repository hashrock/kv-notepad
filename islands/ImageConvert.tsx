import { ChangeEvent } from "preact/compat";

export function encodeWebp(
  src: string,
  quality: number,
  maxWidth: number,
  maxHeight: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();
    image.onload = (ev) => {
      const target = ev?.target as HTMLImageElement;
      const { width, height } = target;
      if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      URL.revokeObjectURL(target.src);
      ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error("Failed to convert to webp"));
          }
        },
        "image/webp",
        quality,
      );
    };

    image.src = src;
    image.onerror = (e) => reject(e);
  });
}

export default function ImageConvert() {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const buffer = reader.result;
      if (buffer && typeof buffer === "string") {
        //to webp
        encodeWebp(buffer, 50, 1000, 1000)
          .then(
            (blob) => {
              console.log(blob.size);
              const url = URL.createObjectURL(blob);
              const img = document.createElement("img");
              img.src = url;
              document.body.appendChild(img);
            },
          );
      }
    };
  }

  return (
    <div>
      <h1>ImageConvert</h1>
      <p>Converts images to different formats</p>
      <input type="file" name="image" onChange={handleChange} />
    </div>
  );
}
