import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Switch } from 'components/ui/switch';
import { type Form } from './enterprise-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { RichTextEditor } from 'components/ui/rich-text';
import { Separator } from 'components/ui/separator';
import { CalendarInput } from './calendar-input';
import { PercentageInput } from './percentage-input';

export const EnterpriseInfo = ({
  form,
  children,
}: {
  form: Form;
  children: React.ReactNode;
}) => (
  <div className="w-full space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Nome do empreendimento</FormLabel>
          <FormControl>
            <Input placeholder="..." error={!!fieldState.error} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="flex flex-col space-y-2">
      <FormItem className="flex items-center space-x-2">
        <FormControl>
          <Switch
            name="has_external_link"
            defaultChecked={form.getValues('has_external_link')}
            onCheckedChange={(checked) => form.setValue('has_external_link', checked)}
          />
        </FormControl>
        <FormLabel className="font-normal italic text-muted-foreground">
          Possui Link Externo
        </FormLabel>
        <FormMessage />
      </FormItem>
      {form.watch('has_external_link') && (
        <FormField
          control={form.control}
          name="external_link"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Link externo</FormLabel>
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
      )}
    </div>
    <FormField
      control={form.control}
      name="tour_virtual"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Tour Virtual</FormLabel>
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

    <FormField
      control={form.control}
      name="status"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Status do empreendimento</FormLabel>
          <FormControl>
            <Select
              defaultValue={form.getValues('status')}
              onValueChange={(v) => field.onChange({ target: { value: v } })}
            >
              <SelectTrigger error={!!fieldState.error}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_work">Em Obras</SelectItem>
                <SelectItem value="soon_launch">Breve Lançamento</SelectItem>
                <SelectItem value="new">Lançamento</SelectItem>
                <SelectItem value="close">100% Vendido</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="address"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Endereço</FormLabel>
          <FormControl>
            <Input
              placeholder="Bairro, Rua, numero"
              error={!!fieldState.error}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Separator className="my-4" />

    <div className="flex flex-col space-y-2">
      <FormField
        control={form.control}
        name="short_desc_emphasis"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Frase destaque</FormLabel>
            <FormControl>
              <Input placeholder="..." error={!!fieldState.error} {...field} />
            </FormControl>
            <span className="italic text-sm text-muted-foreground">
              Essa descrição aparecerá nos cards da página {'"/"'}
            </span>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="desc_emphasis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição destaque</FormLabel>
            <FormControl>
              <RichTextEditor
                defaultValue={field.value}
                onChangeHTML={(v) => form.setValue('desc_emphasis', v)}
              />
            </FormControl>
            <span className="italic text-sm text-muted-foreground">
              Essa descrição aparecerá nos cards da página {'"/imovel"'}
            </span>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <Separator className="my-4" />

    <h3>Datas:</h3>
    <div className="flex w-full space-x-2">
      <CalendarInput
        form={form}
        id="work_start_date"
        label="Data do início da obra"
        disabled={(date) => date > new Date() || date < new Date('2008-01-01')}
        fromYear={2008}
        toYear={new Date().getFullYear()}
      />
      <CalendarInput
        form={form}
        id="work_end_date"
        label="Previsão de entrega"
        disabled={(date) => date < new Date()}
        fromYear={new Date().getFullYear()}
      />
    </div>

    <Separator className="my-4" />

    <h3>Progresso:</h3>
    <div className="flex w-full space-x-2">
      <PercentageInput form={form} label="Terraplanagem" id="earthmoving" />
      <PercentageInput form={form} label="Fundação" id="foundation" />
      <PercentageInput form={form} label="Estrutura" id="structure" />
    </div>
    <div className="flex w-full space-x-2">
      <PercentageInput
        form={form}
        label="Hidráulica / Elétrica"
        id="hydraulic_electrical"
      />
      <PercentageInput
        form={form}
        label="Acabamento / Reboco"
        id="finishing_plastering"
      />
      <PercentageInput form={form} label="Pintura" id="painting" />
    </div>
    <Separator className="my-4" />
    {children}
  </div>
);
