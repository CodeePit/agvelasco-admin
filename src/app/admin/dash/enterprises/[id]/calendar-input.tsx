import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Form, FormSchemaProps } from './enterprise-form';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Button } from 'components/ui/button';
import { cn } from 'utils/cn';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from 'components/ui/calendar';
import { type Matcher } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';

export const CalendarInput = ({
  form,
  id,
  label,
  disabled,
  fromYear,
  toYear,
}: {
  form: Form;
  id: keyof FormSchemaProps;
  label: string;
  disabled?: Matcher | Matcher[] | undefined;
  fromYear?: number;
  toYear?: number;
}) => (
  <FormField
    control={form.control}
    name={id}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  'pl-3 text-left flex w-full font-normal',
                  !field.value && 'text-muted-foreground',
                )}
              >
                {field.value ? (
                  format(field.value as Date, 'PPP', { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown-buttons"
              selected={field.value as Date}
              onSelect={field.onChange}
              disabled={disabled}
              fromYear={fromYear}
              toYear={toYear}
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);
