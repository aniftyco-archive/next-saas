import { Form, rules } from 'next-saas/react';
import clsx from 'clsx';

type Values = {
  user: { firstName: string; lastName: string };
  email: string;
  password: string;
  color: string;
  agree: boolean;
};

const RegisterPage = () => {
  return (
    <Form<Values> onSubmit={(values) => console.log('form submit', values)}>
      <Form.Field type="text" name="user.firstName" label="First Name" />
      <Form.Field type="text" name="user.lastName" label="Last Name" />
      <Form.Field type="email" name="email" label="Email Address" className="border border-blue-500" />
      <Form.Field
        type="password"
        name="password"
        rules={[rules.required('This field is required')]}
        render={(props, errors) => {
          return (
            <div>
              <label htmlFor={props.id} className={clsx({ 'text-red-500 font-semibold': errors })}>
                Password
              </label>
              <input
                className={clsx('border', {
                  'border-red-500': errors,
                  'border-green-500': !errors,
                })}
                {...props}
              />
              {errors && <span className="font-semibold text-red-500"> **{errors[0]}</span>}
            </div>
          );
        }}
      />
      <Form.Field
        type="select"
        name="color"
        label="Favorite Color"
        options={['red', { label: 'Green', value: 'green' }]}
      />
      <Form.Field type="radio" name="picked" label="yes" value="yes" />
      <Form.Field type="radio" name="picked" label="no" value="no" />
      <Form.Field type="checkbox" name="agree" label="agree to terms" />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default RegisterPage;
