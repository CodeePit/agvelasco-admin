import { CardImageDropzone, type DropzoneFields } from 'components/card-dropzone';
import { FormControl, FormItem, FormLabel } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RichTextEditor } from 'components/ui/rich-text';

export const EnterprisePlans = ({
  plans,
  handlePlans,
}: {
  plans: (DropzoneFields & { desc: string })[] | undefined;
  handlePlans: React.Dispatch<
    React.SetStateAction<(DropzoneFields & { desc: string })[] | undefined>
  >;
}) => (
  <CardImageDropzone
    title="Plantas DropZone"
    id="plans"
    handleImages={handlePlans as any}
    images={plans}
    noAlt
    size="(500 x 500)"
    renderForm={(plan) => (
      <div className="space-y-2 space-x-4 items-start flex border-b pb-4">
        <div className="w-fit mt-2">
          <Label htmlFor={plan.id}>Tipo</Label>
          <Input
            id={plan.id}
            placeholder="..."
            name="alt"
            max={2}
            className="w-[100px]"
            defaultValue={plan.label}
            onChange={({ target: { value } }) => {
              plan.label = value;
            }}
            // disabled={loading || isLoading}
          />
        </div>
        <FormItem className="w-full">
          <FormLabel>Planta descrição</FormLabel>
          <FormControl>
            <RichTextEditor
              defaultValue={plan.desc}
              onChangeHTML={(v) => {
                plan.desc = v;
              }}
            />
          </FormControl>
        </FormItem>
      </div>
    )}
  />
);
