import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { api } from 'services/axios';
import { type Enterprise, type EnterprisePartial } from 'types/enterprise';

export async function deleteEnterprise(
  id: number | string,
  imagesIds: EnterprisePartial['imagesIds'],
) {
  await Promise.all(imagesIds.map(deleteMedia));
  return api.delete(`/imovel/${id}`);
}

export async function deleteMedia(id: number | string) {
  return await api
    .delete(`/media/${id}?force=true`)
    .then(() => 'success')
    .catch(() => null);
}

async function getMedia(id: string) {
  try {
    const media = await api
      .get(`/media/${id}?_fields=media_details,source_url`)
      .then((r) => r.data)
      .catch(() => undefined);
    if (!media) throw '';
    return {
      url: media.source_url as string,
      label: '',
      id,
      size: media.media_details.filesize,
    };
  } catch {
    return undefined;
  }
}

export async function getEnterprisesId() {
  return api
    .get('/imovel?_fields=id')
    .then((r) => r.data.map(({ id }: any) => ({ id: `${id}` })))
    .catch(() => []);
}

function returnArray(v: any) {
  if (Array.isArray(v)) return v;
  return [];
}

async function getMediaIfIdExists(id: any) {
  if (!`${id}`.length) return null;
  console.log(id);
  return await getMedia(`${id}`).then((r) => r || null);
}

export async function getEnterprise(id: string) {
  return api
    .get(`/imovel/${id}?_fields=acf,featured_media,id,title`)
    .then(async (r) => {
      const item = r.data;
      const {
        icones,
        galeria,
        plantas,
        imovel_banner,
        galeria_obra,
        sobre_imagem,
        video_background,
        diferenciais_imagem,
        mapa_imagem,
        imovel_banners,
        ...data
      } = item.acf;

      return {
        ...data,
        id: item.id,
        title: item.title.rendered,

        featured_media: await getMediaIfIdExists(item.featured_media),
        sobre_imagem: await getMediaIfIdExists(sobre_imagem),
        video_background: await getMediaIfIdExists(video_background),
        diferenciais_imagem: await getMediaIfIdExists(diferenciais_imagem),
        mapa_imagem: await getMediaIfIdExists(mapa_imagem),

        imovel_banners: await Promise.all(
          returnArray(imovel_banners).map(async (banner: any) => ({
            ...(await getMedia(`${banner.slider_banners_imagem}`)),
            label: banner.slider_banners_link,
          })),
        ),
        icones: await Promise.all(
          returnArray(icones).map(async (icon: any) => ({
            ...(await getMedia(`${icon.icone_imagem}`)),
            label: icon.icone_texto,
          })),
        ),
        galeria: await Promise.all(
          returnArray(galeria).map(async (img: any) => await getMedia(`${img}`)),
        ),
        plantas: await Promise.all(
          returnArray(plantas).map(async (plans: any) => ({
            ...(await getMedia(`${plans.imagem_planta}`)),
            label: plans.tipo,
            desc: plans.descricao_planta,
          })),
        ),
        galeria_obra: await Promise.all(
          returnArray(galeria_obra).map(async (img: any) => await getMedia(`${img}`)),
        ),
      } as Enterprise;
    })
    .catch(() => null);
}

export async function getPartialOfEnterprises(): Promise<EnterprisePartial[] | null> {
  return api
    .get(
      '/imovel?_fields=acf.status,acf.icones,acf.galeria,acf.plantas,acf.imovel_banner,acf.galeria_obra,acf.sobre_imagem,acf.video_background,acf.diferenciais_imagem,acf.mapa_imagem,acf.imovel_banners,featured_media,id,title',
    )
    .then(async (r) => {
      return Promise.all(
        r.data.map(async (item: any) => {
          const media = await getMedia(`${item.featured_media}`);
          return {
            id: item.id,
            title: item.title.rendered,
            status: item.acf.status,
            featured_media: media?.url || null,
            imagesIds: [
              item.featured_media,
              item.sobre_imagem,
              item.video_background,
              item.diferenciais_imagem,
              item.mapa_imagem,
              ...returnArray(item.galeria).map((id: any) => id),
              ...returnArray(item.galeria_obra).map((id: any) => id),
              ...returnArray(item.icones).map(({ icone_imagem }: any) => icone_imagem),
              ...returnArray(item.plantas).map(({ imagem_planta }: any) => imagem_planta),
              ...returnArray(item.imovel_banners).map(
                ({ slider_banners_imagem }: any) => slider_banners_imagem,
              ),
            ].filter((item) => !!item),
          } as EnterprisePartial;
        }),
      );
    })
    .catch(() => null);
}

function monthNameToNumber(monthName: string) {
  const months = {
    jan: 0,
    fev: 1,
    mar: 2,
    abr: 3,
    mai: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    set: 8,
    out: 9,
    nov: 10,
    dez: 11,
  };
  return months[monthName.toLowerCase() as keyof typeof months];
}

function transformDateString(dateString: string) {
  if (!dateString || !dateString.length) return undefined;
  const parts = dateString.split('/');
  const day = parts.length === 3 ? parseInt(parts[0], 10) : 1;
  const month = monthNameToNumber(parts.length === 3 ? parts[1] : parts[0]);
  const year = parseInt(parts[parts.length - 1], 10) + 2000; // Assuming we're working with years after 2000

  return new Date(year, month, day);
}

export function traduceEnterpriseToForm(enterprise: Enterprise) {
  const status = enterprise.status.toLocaleLowerCase();
  return {
    external_link: enterprise.link_empreendimento,
    has_external_link: enterprise.link_externo === 'sim',
    name: enterprise.title,
    short_desc_emphasis: enterprise['destaque_frase_-_home'],
    address: enterprise.endereco,
    desc: enterprise.sobre,
    video: enterprise.video,
    differentials: enterprise.diferenciais_lista,
    desc_map: enterprise.mapa_texto,
    earthmoving: enterprise.terraplenagem ? `${enterprise.terraplenagem}` : undefined,
    foundation: enterprise.fundacao ? `${enterprise.fundacao}` : undefined,
    structure: enterprise.estrutura ? `${enterprise.estrutura}` : undefined,
    tour_virtual: enterprise.tour_virtual ? `${enterprise.tour_virtual}` : undefined,
    hydraulic_electrical: enterprise.hidraulica_eletrica
      ? `${enterprise.hidraulica_eletrica}`
      : undefined,
    finishing_plastering: enterprise.acabamento_reboco
      ? `${enterprise.acabamento_reboco}`
      : undefined,
    painting: enterprise.pintura ? `${enterprise.pintura}` : undefined,
    work_end_date: transformDateString(enterprise.previsao_de_entrega),
    work_start_date: transformDateString(enterprise.inicio_da_obra),
    desc_emphasis: enterprise.destaque_home
      .replaceAll('\r\n', '<br>')
      .replaceAll('\n', '<br>'),
    status: status.includes('breve')
      ? 'soon_launch'
      : status.includes('em obras')
      ? 'under_work'
      : status.includes('100')
      ? 'close'
      : 'new',
  };
}

export function traduceFormToEnterprise(
  enterprise: Partial<ReturnType<typeof traduceEnterpriseToForm>>,
) {
  return {
    title: enterprise.name,
    status: 'publish',
    acf: {
      link_externo: enterprise.has_external_link ? 'sim' : 'nao',

      video: enterprise.video || '',
      link_empreendimento: enterprise.external_link || '',
      'destaque_frase_-_home': enterprise.short_desc_emphasis || '',

      diferenciais_lista: enterprise.differentials?.replaceAll('<br>', '\r\n') || '',
      mapa_texto: enterprise.desc_map?.replaceAll('<br>', '\r\n') || '',
      destaque_home: enterprise.desc_emphasis?.replaceAll('<br>', '\r\n') || '',
      sobre: enterprise.desc?.replaceAll('<br>', '\r\n') || '',

      inicio_da_obra: enterprise.work_start_date
        ? format(enterprise.work_start_date, 'dd/MMM/yy', { locale: ptBR })
        : '',
      previsao_de_entrega: enterprise.work_end_date
        ? format(enterprise.work_end_date, 'dd/MMM/yy', { locale: ptBR })
        : '',

      terraplenagem: enterprise.earthmoving || '',
      fundacao: enterprise.foundation || '',
      estrutura: enterprise.structure || '',
      hidraulica_eletrica: enterprise.hydraulic_electrical || '',
      acabamento_reboco: enterprise.finishing_plastering || '',
      pintura: enterprise.painting || '',
      endereco: enterprise.address || '',
      tour_virtual: enterprise.tour_virtual || '',
      status:
        enterprise.status === 'soon_launch'
          ? 'BREVE LANÇAMENTO'
          : enterprise.status === 'new'
          ? 'EM OBRAS'
          : enterprise.status === 'close'
          ? '100% VENDIDO'
          : 'LANÇAMENTO',

      mapa: '',
      whatsapp: 15996873355,
      whatsapp_numero: '(15) 99687-3355',
      facebook: 'https://www.facebook.com/agvelascoconstrutora',
      h2: '',
      imovel_banner: null,
    },
  };
}
