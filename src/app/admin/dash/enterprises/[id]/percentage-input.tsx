import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { InputMask } from 'components/ui/input';
import { FormSchemaProps, type Form } from './enterprise-form';

export const PercentageInput = ({
  form,
  id,
  label,
}: {
  form: Form;
  id: keyof FormSchemaProps;
  label: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl className="relative">
            <div className="flex">
              <InputMask
                placeholder="100"
                mask={[/\d/, /\d/, /\d/]}
                showMask={false}
                error={!!fieldState.error}
                {...field}
                value={value as string}
                className="rounded-l-none z-10"
                onChange={(ev) => {
                  if (Number(ev.target.value) > 100) onChange({ target: { value: 100 } });
                  else onChange(ev);
                }}
              />
              <span
                className="h-9 z-0 items-center flex justify-center rounded-r-none w-9 border bg-accent text-muted-foreground pointer-events-none text-sm"
                aria-hidden
              >
                %
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
