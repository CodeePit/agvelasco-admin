'use client';
import * as z from 'zod';
import { type Enterprise } from 'types/enterprise';
import { useRouter } from 'next/navigation';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Button } from 'components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { traduceEnterpriseToForm } from 'utils/enterprises-func';
import { EnterpriseInfo } from './enterprise-info';
import { CardImageDropzone, DropzoneFields } from 'components/card-dropzone';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';
import { SectionsWithBanner } from './sections-with-banner';
import { EnterprisePlans } from './enterprise-plans';
import { UploadImageInput } from 'components/upload-image-input';
import { createEnterprise } from './create-enterprise';
import { editEnterprise } from './edit-enterprise';

const FormSchema = z.object({
  name: z.string().optional(),
  status: z.string().default('under_work').optional(),
  desc_emphasis: z.string().optional(),
  external_link: z.string().url().optional(),
  video: z.string().url().optional(),
  has_external_link: z.boolean().optional(),
  short_desc_emphasis: z.string().optional(),
  desc: z.string().optional(),
  differentials: z.string().optional(),
  desc_map: z.string().optional(),
  work_start_date: z.date().optional(),
  work_end_date: z.date().optional(),
  earthmoving: z.string().optional(),
  foundation: z.string().optional(),
  structure: z.string().optional(),
  hydraulic_electrical: z.string().optional(),
  finishing_plastering: z.string().optional(),
  address: z.string().optional(),
  painting: z.string().optional(),
  tour_virtual: z.string().url().optional(),
});

export type FormSchemaProps = z.infer<typeof FormSchema>;
export type Form = UseFormReturn<FormSchemaProps>;

export const EnterpriseForm = ({
  id,
  enterprise,
}: {
  id: string;
  enterprise?: Enterprise;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<File | null>(null);
  const [descBanner, setDescBanner] = useState<File | null>(null);
  const [differentialsBanner, setDifferentialsBanner] = useState<File | null>(null);
  const [videoBanner, setVideoBanner] = useState<File | null>(null);
  const [descMapBanner, setDescMapBanner] = useState<File | null>(null);

  const [banners, setBanners] = useState<DropzoneFields[] | undefined>(
    enterprise?.imovel_banners.map(({ url, ...item }) => ({ file: url, ...item })),
  );
  const [icons, setIcons] = useState<DropzoneFields[] | undefined>(
    enterprise?.icones.map(({ url, ...item }) => ({ file: url, ...item })),
  );
  const [galleria, setGalleria] = useState<DropzoneFields[] | undefined>(
    enterprise?.galeria.map(({ url, ...item }) => ({ file: url, ...item })),
  );
  const [galleriaWork, setGalleriaWork] = useState<DropzoneFields[] | undefined>(
    enterprise?.galeria_obra.map(({ url, ...item }) => ({ file: url, ...item })),
  );
  const [plans, setPlans] = useState<(DropzoneFields & { desc: string })[] | undefined>(
    enterprise?.plantas.map(({ url, ...item }) => ({ file: url, ...item })),
  );

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(FormSchema as any),
    defaultValues: enterprise && traduceEnterpriseToForm(enterprise),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          setLoading(true);

          (id === 'create'
            ? createEnterprise(data, {
                banner,
                descBanner,
                differentialsBanner,
                videoBanner,
                descMapBanner,
                banners,
                icons,
                galleria,
                galleriaWork,
                plans,
              })
            : editEnterprise(
                data,
                {
                  banner,
                  descBanner,
                  differentialsBanner,
                  videoBanner,
                  descMapBanner,
                  banners,
                  icons,
                  galleria,
                  galleriaWork,
                  plans,
                },
                enterprise,
              )
          ).finally(() => setLoading(false));
          // .then(() => router.push('/admin/dash/enterprises'))
        })}
        className="space-y-6 py-8 flex flex-col w-full mx-auto max-w-7xl px-8"
      >
        <div className="flex space-x-8">
          <EnterpriseInfo form={form}>
            <div className="flex space-x-8">
              <div className="flex w-full flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="video"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          type="url"
                          error={!!fieldState.error}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full">
                  <h3>Banner</h3>
                  <span className="italic text-sm text-muted-foreground">
                    clique ou arraste os arquivos para seleciona-los.
                  </span>
                  <UploadImageInput
                    file={
                      videoBanner ? videoBanner : enterprise?.video_background || null
                    }
                    handleFile={setVideoBanner}
                    id="video_banner"
                  />
                </div>
              </div>
            </div>
            <CardImageDropzone
              title="Obra galeria DropZone"
              id="work"
              handleImages={setGalleriaWork}
              images={galleriaWork}
            />
          </EnterpriseInfo>
          <div className="w-full flex flex-col space-y-8">
            <div className="w-full mt-18">
              <h3>Banner destaque</h3>
              <span className="italic text-sm text-muted-foreground">
                clique ou arraste os arquivos para seleciona-los.
              </span>
              <UploadImageInput
                file={
                  banner
                    ? banner
                    : enterprise?.featured_media.length
                    ? enterprise?.featured_media
                    : null
                }
                handleFile={setBanner}
                id={id}
              />
              <span className="italic text-sm text-muted-foreground">
                Esse banner será utilizado como imagem para os cards do empreendimento.
              </span>
            </div>
            <CardImageDropzone
              title="Informações com Icones DropZone"
              id="icons"
              handleImages={setIcons}
              images={icons}
              fileSizeType="Kb"
            />
            <CardImageDropzone
              title="Galeria DropZone"
              id="galleria"
              handleImages={setGalleria}
              images={galleria}
            />
            <CardImageDropzone
              title="Banners DropZone"
              id="banner"
              handleImages={setBanners}
              images={banners}
            />
          </div>
        </div>

        <Separator className="my-4" />
        <SectionsWithBanner
          form={form}
          desc_banner={{
            file: descBanner
              ? descBanner
              : enterprise?.sobre_imagem.length
              ? enterprise?.sobre_imagem
              : null,
            handleFile: setDescBanner,
          }}
          desc_map_banner={{
            file: descMapBanner
              ? descMapBanner
              : enterprise?.mapa_imagem.length
              ? enterprise?.mapa_imagem
              : null,
            handleFile: setDescMapBanner,
          }}
          differentials_banner={{
            file: differentialsBanner
              ? differentialsBanner
              : enterprise?.diferenciais_imagem.length
              ? enterprise?.diferenciais_imagem
              : null,
            handleFile: setDifferentialsBanner,
          }}
        />
        <Separator className="my-4" />
        <EnterprisePlans handlePlans={setPlans} plans={plans} />

        <Button size="lg" className="uppercase" disabled={loading}>
          {enterprise ? (
            <>
              Editar Empreendimento <Pencil className="ml-4 h-6 w-6" />
            </>
          ) : (
            <>
              Criar Empreendimento <Plus className="ml-4 h-6 w-6" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
