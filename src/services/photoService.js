import api from './api';

export async function uploadPhoto(pinId, tipo, blob, seq) {
  const response = await api.post(`/pins/${pinId}/fotos/${tipo}`, blob, {
    params: { seq },
    headers: { 'Content-Type': 'image/jpeg' },
  });
  return response.data.fileName;
}

export async function completePhotos(pinId, tipo, fileNames) {
  const response = await api.post(`/pins/${pinId}/fotos/${tipo}/concluir`, { fileNames });
  return response.data;
}

// Uploads one photo at a time, then confirms the set. Never throws: a failure leaves the pin
// "pendente" on the server and is reported here so the screen can warn and move on.
export async function uploadPinPhotos(pinId, tipo, blobs, onProgress) {
  const fileNames = [];
  try {
    for (let i = 0; i < blobs.length; i += 1) {
      fileNames.push(await uploadPhoto(pinId, tipo, blobs[i], i + 1));
      onProgress?.(i + 1, blobs.length);
    }
    await completePhotos(pinId, tipo, fileNames);
    return { ok: true, uploaded: fileNames.length };
  } catch (err) {
    const result = { ok: false, uploaded: fileNames.length };
    const message = err?.response?.data?.error;
    if (message) result.error = message;
    return result;
  }
}
