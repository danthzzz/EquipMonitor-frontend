// Photos are shrunk in the browser before upload: the backend (Vercel) accepts ~4.5 MB per
// request and phone photos are 3–6 MB. 1600 px / JPEG 0.8 gives ~300–500 KB.
export const MAX_SIDE = 1600;
export const JPEG_QUALITY = 0.8;

export function fitWithin(width, height, maxSide = MAX_SIDE) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function toResizedJpeg(source, srcWidth, srcHeight) {
  const { width, height } = fitWithin(srcWidth, srcHeight);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível processar a foto'))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

// Fallback path (native camera through <input type="file">).
export async function fileToResizedJpeg(file) {
  const bitmap = await createImageBitmap(file);
  try {
    return await toResizedJpeg(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close?.();
  }
}
