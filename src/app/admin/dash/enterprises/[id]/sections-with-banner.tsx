import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { RichTextEditor } from 'components/ui/rich-text';
import { UploadImageInput } from 'components/upload-image-input';
import { FormSchemaProps, type Form } from './enterprise-form';
import { Input } from 'components/ui/input';

type HandleFile = { file: File | string | null; handleFile: (file: File | null) => void };

const RichTextWithImageUpload = ({
  form,
  file,
  handleFile,
  id,
  label,
}: {
  id: keyof FormSchemaProps;
  label: string;
  form: Form;
} & HandleFile) => (
  <div className="flex space-x-8">
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor
              className="!max-h-[315px] !min-h-[315px]"
              defaultValue={field.value as string}
              onChangeHTML={(v) => form.setValue(id, v)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="w-full">
      <h3>Banner: {label}</h3>
      <span className="italic text-sm text-muted-foreground">
        clique ou arraste os arquivos para seleciona-los. <br />
        (590 × 332)
      </span>
      <UploadImageInput file={file} handleFile={handleFile} id={id} />
    </div>
  </div>
);

export const SectionsWithBanner = ({
  form,
  desc_banner,
  desc_map_banner,
  differentials_banner,
}: {
  form: Form;
  desc_banner: HandleFile;
  desc_map_banner: HandleFile;
  differentials_banner: HandleFile;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <RichTextWithImageUpload
        id="desc"
        label="Sobre o empreendimento"
        {...desc_banner}
        form={form}
      />
      <RichTextWithImageUpload
        id="differentials"
        label="Diferenciais"
        {...differentials_banner}
        form={form}
      />
      <RichTextWithImageUpload
        id="desc_map"
        label="Descrição mapa"
        {...desc_map_banner}
        form={form}
      />
    </div>
  );
};
