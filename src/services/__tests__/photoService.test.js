import api from '../api';
import { uploadPhoto, completePhotos, uploadPinPhotos } from '../photoService';

const blob = () => new Blob([new Uint8Array([0xff, 0xd8])], { type: 'image/jpeg' });
const blobs = (n) => Array.from({ length: n }, blob);

afterEach(() => vi.restoreAllMocks());

describe('uploadPhoto', () => {
  it('posts the JPEG with its sequence number', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: { fileName: 'entrada_1.jpg' } });
    const photo = blob();
    await expect(uploadPhoto('p1', 'entrada', photo, 3)).resolves.toBe('entrada_1.jpg');
    expect(post).toHaveBeenCalledWith('/pins/p1/fotos/entrada', photo, { params: { seq: 3 }, headers: { 'Content-Type': 'image/jpeg' } });
  });
});

describe('completePhotos', () => {
  it('sends the file names of this session', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: { _id: 'p1', fotosEntrada: 'ok' } });
    await completePhotos('p1', 'saida', ['a.jpg']);
    expect(post).toHaveBeenCalledWith('/pins/p1/fotos/saida/concluir', { fileNames: ['a.jpg'] });
  });
});

describe('uploadPinPhotos', () => {
  it('uploads in order and then completes', async () => {
    const post = vi.spyOn(api, 'post').mockImplementation(async (url, body, config) =>
      url.endsWith('/concluir') ? { data: {} } : { data: { fileName: `f${config.params.seq}.jpg` } }
    );
    const progress = vi.fn();
    const result = await uploadPinPhotos('p1', 'entrada', blobs(5), progress);
    expect(result).toEqual({ ok: true, uploaded: 5 });
    expect(post.mock.calls.slice(0, 5).map((c) => c[2].params.seq)).toEqual([1, 2, 3, 4, 5]);
    expect(post).toHaveBeenLastCalledWith('/pins/p1/fotos/entrada/concluir', { fileNames: ['f1.jpg', 'f2.jpg', 'f3.jpg', 'f4.jpg', 'f5.jpg'] });
    expect(progress).toHaveBeenCalledTimes(5);
    expect(progress).toHaveBeenLastCalledWith(5, 5);
  });

  it('stops and reports when the 3rd upload fails', async () => {
    let n = 0;
    const post = vi.spyOn(api, 'post').mockImplementation(async () => {
      n += 1;
      if (n === 3) throw new Error('Network Error');
      return { data: { fileName: `f${n}.jpg` } };
    });
    const result = await uploadPinPhotos('p1', 'entrada', blobs(5));
    expect(result.ok).toBe(false);
    expect(result.uploaded).toBe(2);
    expect(post.mock.calls.some(([url]) => url.endsWith('/concluir'))).toBe(false);
  });

  it('surfaces the server message', async () => {
    vi.spyOn(api, 'post').mockRejectedValue({ response: { status: 502, data: { error: 'Falha no SharePoint (403 accessDenied)' } } });
    const result = await uploadPinPhotos('p1', 'saida', blobs(5));
    expect(result).toEqual({ ok: false, uploaded: 0, error: 'Falha no SharePoint (403 accessDenied)' });
  });
});
