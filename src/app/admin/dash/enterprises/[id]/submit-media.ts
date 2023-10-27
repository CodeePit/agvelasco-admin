import { DropzoneFields } from 'components/card-dropzone';
import { api } from 'services/axios';

export async function submitMedia(file: File | null, arr: number[]) {
  try {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file, file.name);
    const id = await api
      .post('/media', formData)
      .then((r) => r.data.id)
      .catch(() => {
        throw 'err';
      });
    arr.push(id);
    return Number(id);
  } catch {
    throw 'err';
  }
}

export async function submitMedias(files: DropzoneFields[] | undefined, arr: number[]) {
  try {
    if (!files) return [];
    const filesUploaded = [];
    for (let i = 0; i < files.length; i++) {
      let fileId;
      if (files[i].id.includes('new')) {
        fileId = await submitMedia(files[i].file as File, arr);
      }
      filesUploaded.push({
        ...files[i],
        file: undefined,
        id: fileId || Number(files[i].id),
      });
    }
    return filesUploaded;
  } catch {
    throw 'err';
  }
}
