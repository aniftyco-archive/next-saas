import { Fragment } from 'react';
import handler, { InferProps, Page } from 'next-saas';

type Props = {
  foo: string;
  bar: number;
  date: Date;
  baz?: string;
};

type Query = never;

type Body = {
  baz: string;
};

export const getServerSideProps = handler<Props, Query, Body>({
  loader() {
    return { foo: '123', bar: 456, date: new Date() };
  },
  async action({ req }) {
    return { foo: '123', bar: 456, baz: req.body.baz, date: new Date() };
  },
});

const GSSP: Page<InferProps<typeof getServerSideProps>> = (props) => {
  return (
    <Fragment>
      <strong>gSSP Props:</strong>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Fragment>
  );
};

export default GSSP;
