/**
 * Shrinks phone screenshots (often 2–5 MB PNGs) to a ~200 KB JPEG before upload.
 * Text in the screenshot stays readable at 1600px on the long edge.
 * Falls back to the original file if the browser can't decode it (e.g. HEIC on Chrome).
 */
export async function compressImage(file: File, maxEdge = 1600): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], "payment-screenshot.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
