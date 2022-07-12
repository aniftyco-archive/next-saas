import { ChangeEventHandler, FC, FocusEventHandler } from 'react';
import { Rule, useField } from '../hooks/useForm';

export type FieldRenderProps<Value> = {
  name: string;
  id: string;
  type: InputProps['type'] | CheckboxProps['type'] | SelectProps['type'];
  value: Value;
  onChange: ChangeEventHandler<any>;
  onBlur: FocusEventHandler<any>;
};

export type CommonProps<Value> = {
  name: string;
  label?: string;
  className?: string;
  rules?: Rule[];
  value?: Value;
  render?: (props: FieldRenderProps<Value>, errors: null | string[]) => JSX.Element;
};

export type InputProps = CommonProps<string> & {
  type: 'text' | 'password' | 'email';
};

export type CheckboxProps = CommonProps<boolean> & {
  type: 'checkbox';
};

export type SelectOption = {
  label: string;
  value: string;
};
export type SelectProps = CommonProps<string> & {
  type: 'select';
  options: (SelectOption | string)[];
};

export type Props = InputProps | CheckboxProps | SelectProps;

export const Field: FC<Props> = ({
  name,
  type,
  rules,
  className,
  label,
  value: defaultValue,
  options = [],
  render = renderer(type, label),
}: any) => {
  if (type == 'checkbox' && typeof defaultValue === 'undefined') {
    defaultValue = false;
  } else if (type == 'select' && typeof defaultValue === 'undefined') {
    defaultValue = typeof options[0] === 'string' ? options[0] : options[0].value;
  } else if (typeof defaultValue === 'undefined') {
    defaultValue = '';
  }

  const { handleChange: onChange, handleBlur, value, errors } = useField({ name, value: defaultValue, rules });

  const handleChange = (e: any) => {
    if (type === 'checkbox') {
      return onChange(e.target.checked);
    }

    return onChange(e.target.value);
  };

  if (typeof value !== 'undefined') {
    const props = {
      name,
      type,
      value,
      id: name,
      onChange: handleChange,
      onBlur: handleBlur,
    };

    if (type === 'select') {
      (props as any).options = options.map((option: string | SelectOption) => {
        if (typeof option === 'string') {
          return { label: option, value: option };
        }

        return option;
      });
    }

    if (render._default) {
      (props as any).className = className;
    }

    return render(props, errors);
  }

  return null;
};

type RendererType = Props['type'];
type RendererProps = {
  id: string;
  options?: SelectOption[];
  onChange: (value: any) => void;
};

const renderer = (type: RendererType, label?: string) => {
  const genField = ({ options = [], ...props }: RendererProps) => {
    switch (type) {
      case 'select':
        return (
          <select {...props}>
            {options.map(({ label, value }) => (
              <option key={label} label={label} value={value} />
            ))}
          </select>
        );
      case 'checkbox':
      case 'text':
      case 'password':
      case 'email':
      default:
        return <input type={type} {...props} />;
    }
  };

  const fn = (props: RendererProps) => {
    if (label) {
      return (
        <div>
          {type !== 'checkbox' && <label htmlFor={props.id}>{label}</label>}
          {genField(props)}
          {type === 'checkbox' && <label htmlFor={props.id}>{label}</label>}
        </div>
      );
    }

    return genField(props);
  };

  fn._default = true;

  return fn;
};
