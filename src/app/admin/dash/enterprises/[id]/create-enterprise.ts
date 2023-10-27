import { DropzoneFields } from 'components/card-dropzone';
import { FormSchemaProps } from './enterprise-form';
import { api } from 'services/axios';
import { deleteMedia, traduceFormToEnterprise } from 'utils/enterprises-func';

async function submitMedia(file: File | null, arr: number[]) {
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

async function submitMedias(files: DropzoneFields[] | undefined, arr: number[]) {
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

export async function createEnterprise(
  data: FormSchemaProps,
  images: {
    banner: File | null;
    descBanner: File | null;
    differentialsBanner: File | null;
    videoBanner: File | null;
    descMapBanner: File | null;
    banners: DropzoneFields[] | undefined;
    icons: DropzoneFields[] | undefined;
    galleria: DropzoneFields[] | undefined;
    galleriaWork: DropzoneFields[] | undefined;
    plans: (DropzoneFields & { desc: string })[] | undefined;
  },
) {
  const ifErrImagesToDelete: number[] = [];
  try {
    const formattedData = traduceFormToEnterprise(data);

    const featured_media = await submitMedia(images.banner, ifErrImagesToDelete);
    const sobre_imagem = await submitMedia(images.descBanner, ifErrImagesToDelete);
    const video_background = await submitMedia(images.videoBanner, ifErrImagesToDelete);
    const mapa_imagem = await submitMedia(images.descMapBanner, ifErrImagesToDelete);
    const diferenciais_imagem = await submitMedia(
      images.differentialsBanner,
      ifErrImagesToDelete,
    );

    const galeria_obra = (
      await submitMedias(images.galleriaWork, ifErrImagesToDelete)
    ).map(({ id }) => id);
    const galeria = (await submitMedias(images.galleria, ifErrImagesToDelete)).map(
      ({ id }) => id,
    );

    const imovel_banners = (await submitMedias(images.banners, ifErrImagesToDelete)).map(
      ({ id, label }) => ({ slider_banners_imagem: id, slider_banners_link: label }),
    );
    const icones = (await submitMedias(images.icons, ifErrImagesToDelete)).map(
      ({ id, label }) => ({ icone_imagem: id, icone_texto: label }),
    );
    const plantas = (await submitMedias(images.plans, ifErrImagesToDelete)).map(
      ({ id, label, desc }: any) => ({
        tipo: label,
        imagem_planta: id,
        descricao_planta: desc?.replaceAll('<br>', '\r\n'),
      }),
    );

    await api.post('/imovel', {
      status: formattedData.status,
      title: formattedData.title,
      featured_media,
      acf: {
        ...formattedData.acf,
        sobre_imagem,
        video_background,
        mapa_imagem,
        diferenciais_imagem,
        galeria_obra,
        galeria,
        imovel_banners,
        icones,
        plantas,
      },
    });
    return true;
  } catch {
    await Promise.all(
      ifErrImagesToDelete.map(async (id) => {
        await deleteMedia(id);
        return id;
      }),
    );

    throw 'err';
  }
}
