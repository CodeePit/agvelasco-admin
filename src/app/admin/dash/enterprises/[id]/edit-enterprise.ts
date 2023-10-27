import { DropzoneFields } from 'components/card-dropzone';
import { FormSchemaProps } from './enterprise-form';
import { api } from 'services/axios';
import { deleteMedia, traduceFormToEnterprise } from 'utils/enterprises-func';
import { submitMedia, submitMedias } from './submit-media';
import { type ImageField, type Enterprise } from 'types/enterprise';

function valuesAreDifferent(obj: Record<string, any>, obj2?: Record<string, any>) {
  const objArr = Object.entries(obj);
  let isDifferent = false;
  for (let i = 0; i < objArr.length; i++) {
    if (['file', 'size'].includes(objArr[i][0])) return;
    if (obj2?.[objArr[i][0]] !== objArr[i][1]) {
      isDifferent = true;
      break;
    }
  }
  return isDifferent;
}
async function handleImages(
  images: DropzoneFields[] | undefined,
  defaultImages: ImageField[] | undefined,
  ifErrImagesToDelete: number[],
) {
  const defaultImagesIds = defaultImages?.map(({ id }) => id) || [];
  const imagesIds = images?.map(({ id }) => id) || [];
  const newImages =
    images?.reduce((acc, image) => {
      const defaultImage = defaultImages?.find(({ id }) => image.id === id);
      if (
        !defaultImagesIds.includes(image.id) ||
        (defaultImagesIds.includes(image.id) && valuesAreDifferent(image, defaultImage))
      )
        acc.push(image);

      return acc;
    }, [] as DropzoneFields[]) || [];
  const removedImages = defaultImagesIds.filter((id) => !imagesIds.includes(id));

  await Promise.all(removedImages.map(deleteMedia));

  const imagesSubmitted = await submitMedias(
    newImages.filter(({ id }) => id.includes('new')),
    ifErrImagesToDelete,
  );

  if (!newImages.length && !imagesSubmitted.length) return undefined;

  return [...newImages.filter(({ id }) => !id.includes('new')), ...imagesSubmitted];
}

export async function editEnterprise(
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
  defaultValues?: Enterprise,
) {
  const ifErrImagesToDelete: number[] = [];
  try {
    const formattedData = traduceFormToEnterprise(data);
    const onlyEditedAcf = Object.entries(formattedData.acf)
      .filter(([k, v]) =>
        defaultValues
          ? [
              'link_externo',
              'mapa',
              'whatsapp',
              'whatsapp_numero',
              'facebook',
              'h2',
              'endereco',
            ].includes(k) || defaultValues[k as keyof Enterprise] !== v
          : true,
      )
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Partial<Enterprise>);

    const featured_media =
      (await submitMedia(images.banner, ifErrImagesToDelete)) || undefined;
    const sobre_imagem =
      (await submitMedia(images.descBanner, ifErrImagesToDelete)) || undefined;
    const video_background =
      (await submitMedia(images.videoBanner, ifErrImagesToDelete)) || undefined;
    const mapa_imagem =
      (await submitMedia(images.descMapBanner, ifErrImagesToDelete)) || undefined;
    const diferenciais_imagem =
      (await submitMedia(images.differentialsBanner, ifErrImagesToDelete)) || undefined;

    const galeria_obra = (
      await handleImages(
        images.galleriaWork,
        defaultValues?.galeria_obra,
        ifErrImagesToDelete,
      )
    )?.map(({ id }) => id);
    const galeria = (
      await handleImages(images.galleria, defaultValues?.galeria, ifErrImagesToDelete)
    )?.map(({ id }) => id);

    const imovel_banners = (
      await handleImages(
        images.banners,
        defaultValues?.imovel_banners,
        ifErrImagesToDelete,
      )
    )?.map(({ id, label }) => ({
      slider_banners_imagem: id,
      slider_banners_link: label,
    }));
    const icones = (
      await handleImages(images.icons, defaultValues?.icones, ifErrImagesToDelete)
    )?.map(({ id, label }) => ({ icone_imagem: id, icone_texto: label }));
    const plantas = (
      await handleImages(images.plans, defaultValues?.plantas, ifErrImagesToDelete)
    )?.map(({ id, label, desc }: any) => ({
      tipo: label,
      imagem_planta: id,
      descricao_planta: desc?.replaceAll('<br>', '\r\n'),
    }));

    await api.post(`/imovel/${defaultValues?.id}`, {
      title:
        formattedData.title !== defaultValues?.title ? formattedData.title : undefined,
      featured_media,
      acf: {
        ...onlyEditedAcf,
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
  } catch (err) {
    await Promise.all(
      ifErrImagesToDelete.map(async (id) => {
        await deleteMedia(id);
        return id;
      }),
    );

    throw err;
  }
}
