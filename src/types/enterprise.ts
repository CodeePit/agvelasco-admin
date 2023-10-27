export type ImageField = {
  id: string;
  url: string;
  label: string;
  eid: string;
  size: number;
};
export type Datasheet = { id: string; label: string; value: string; eid: string };

export type Enterprise = {
  id: number;
  title: string;
  featured_media: string;
  link_externo: string;
  link_empreendimento: string;
  status: string;
  destaque_home: string;
  'destaque_frase_-_home': string;
  sobre: string;
  sobre_imagem: string;
  video_background: string;
  video: string;
  diferenciais_imagem: string;
  diferenciais_lista: string;
  mapa_texto: string;
  mapa_imagem: string;
  inicio_da_obra: string;
  previsao_de_entrega: string;
  terraplenagem: string;
  fundacao: string;
  estrutura: string;
  hidraulica_eletrica: string;
  acabamento_reboco: string;
  pintura: string;
  endereco: string;
  tour_virtual: string;

  galeria_obra: ImageField[];
  galeria: ImageField[];
  icones: ImageField[];
  imovel_banners: ImageField[];
  plantas: (ImageField & { desc: string })[];
};

export type EnterprisePartial = Pick<
  Enterprise,
  'id' | 'featured_media' | 'title' | 'status'
> & { imagesIds: (number | string)[] };
