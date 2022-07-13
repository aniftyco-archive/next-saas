import {
  createContext,
  Dispatch,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { get, set } from 'lodash';

export type Value = string | boolean | number;
export type Validation = string | undefined;
export type Rule = (value: Value, values: Record<string, Value>) => Validation;
export type Rules = { [key: string]: Rule[] };

export const rules = {
  required:
    (message = 'This field is required'): Rule =>
    (value: Value) => {
      if (!value || !value.toString().length) {
        return message;
      }
    },
  email:
    (message = 'Email address is invalid'): Rule =>
    (value: Value) => {
      const isEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!isEmail.test(String(value).toLowerCase())) {
        return message;
      }
    },
  matches:
    (regex: RegExp, message: string): Rule =>
    (value: Value) => {
      if (regex.test(String(value))) {
        return message;
      }
    },
  matchesValue:
    (matcher: string | ((values: Record<string, Value>) => Value), message: string): Rule =>
    (value: Value, values: Record<string, Value>) => {
      if ((typeof matcher === 'string' ? values[matcher] : matcher(values)) !== value) {
        return message;
      }
    },
  requiredIf:
    (predicate: (values: Record<string, Value>) => boolean, message: string): Rule =>
    (value: Value, values: Record<string, Value>) => {
      if ((!value || !value.toString().length) && predicate(values)) {
        return message;
      }
    },
};

export type Blurred = Record<string, boolean>;
export type Error = { name: string; message: string };

export type Context = {
  rules: MutableRefObject<Rules>;
  values: any;
  errors: Error[];
  blurred: Blurred;
  options: FormOptions;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  setErrors: Dispatch<SetStateAction<Error[]>>;
  setBlurred: Dispatch<SetStateAction<Blurred>>;
  hasBlurred: (name: string) => any;
  updateValue: (name: string, value: Value) => any;
  handleSubmit: (event: FormEvent) => void | Promise<void>;
};

export const FormContext = createContext<Context>({} as Context);
export const FormProvider = FormContext.Provider;
export const FormConsumer = FormContext.Consumer;

export type UseForm<Values = Record<string, Value>> = {
  onSubmit: (values: Values) => void | Promise<void>;
  values?: Values;
  options?: FormOptions;
};

export type FormOptions = {
  validateOnBlur?: boolean;
};

const defaultFormOptions: FormOptions = {
  validateOnBlur: true,
};

export const useForm = <Values extends Record<string, Value>>({
  onSubmit,
  values: initialValues,
  options = defaultFormOptions,
}: UseForm<Values>) => {
  const rules = useRef<Rules>({});
  const [values, setValues] = useState<Values>(initialValues || ({} as Values));
  const [blurred, setBlurred] = useState<Blurred>({});
  const [errors, setErrors] = useState<Error[]>([]);
  const [isSubmitting, setIsSubmiting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  return {
    rules,
    values,
    errors,
    blurred,
    isSubmitting,
    hasSubmitted,
    options,
    setValues,
    setErrors,
    setBlurred,
    hasBlurred: (name: string) => {
      if (blurred[name]) {
        return;
      }

      setBlurred({
        ...blurred,
        [name]: true,
      });
    },
    updateValue: (name: string, value: Value) => {
      setValues((currentValues) => {
        return set({ ...currentValues } as any, name, value);
      });
    },
    handleSubmit: (event: FormEvent) => {
      event.preventDefault();
      setHasSubmitted(true);

      const errors = validate({ values, rules });

      setErrors(errors);

      if (!errors.length) {
        setIsSubmiting(true);
        return Promise.resolve(onSubmit(values)).finally(() => {
          setIsSubmiting(false);
        });
      }

      setBlurred(
        Object.keys(rules.current).reduce((keys, name) => {
          return { ...keys, [name]: true };
        }, {})
      );
    },
  };
};

type Validate<Values = Record<string, Value>> = {
  values: Values;
  rules: MutableRefObject<Rules>;
  blurred?: Blurred;
};

const validate = ({ values, rules, blurred }: Validate) => {
  return Object.keys(rules.current)
    .filter((field) => {
      if (blurred) return blurred[field];
      return true;
    })
    .map((field) =>
      rules.current[field].map((rule) => {
        const error = rule(get(values, field) || '', values);

        if (!error) {
          return false;
        }

        return {
          name: field,
          message: error,
        };
      })
    )
    .reduce((errors, row) => [...errors, ...row], [])
    .filter(Boolean) as Error[];
};

export type UseField = {
  name: string;
  value: Value;
  onChange?: (value: Value) => void;
  rules?: Rule[];
};

export const useField = ({ name, value: defaultValue, onChange = () => {}, rules: fieldRules }: UseField) => {
  const { errors, values, setErrors, hasBlurred, updateValue, blurred, rules, options } = useContext(FormContext);

  useEffect(() => {
    rules.current[name] = fieldRules || [];

    updateValue(name, defaultValue);

    return () => {
      delete rules.current[name];
    };
  }, [name, defaultValue, fieldRules]);

  const fieldErrors = errors.filter((error) => error.name === name).map((error) => error.message);

  const validation = {
    values,
    rules,
    blurred,
    errors,
  };

  const handleChange = (value: Value) => {
    if (fieldErrors.length || blurred[name]) {
      const newValues = { ...values };

      set(newValues, name, value);

      setErrors(() =>
        validate({
          ...validation,
          values: newValues,
          blurred: { ...blurred, [name]: true },
        })
      );
    }

    onChange(value);

    updateValue(name, value);
  };

  const handleBlur = () => {
    hasBlurred(name);
    options.validateOnBlur &&
      setErrors(() =>
        validate({
          ...validation,
          blurred: { ...blurred, [name]: true },
        })
      );
  };

  return {
    handleBlur,
    handleChange,
    value: get(values, name),
    values,
    errors: fieldErrors.length ? fieldErrors : null,
  };
};
