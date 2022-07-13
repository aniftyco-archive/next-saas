import { ReactNode } from 'react';
import { FormProvider, useForm } from '../hooks/useForm';
import { Field } from './Field';

export type Props<Values> = {
  children: ReactNode;
  onSubmit: (values: Values) => void | Promise<void>;
  className?: string;
  validateOnBlur?: boolean;
};

export const Form = <V extends Record<string, any>>({
  children,
  onSubmit,
  className,
  validateOnBlur = true,
}: Props<V>) => {
  const form = useForm({ onSubmit, options: { validateOnBlur } });

  return (
    <FormProvider value={form}>
      <form className={className} onSubmit={form.handleSubmit} method="get">
        {children}
      </form>
    </FormProvider>
  );
};

Form.Field = Field;
