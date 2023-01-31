import { Fragment } from 'react';
import { NextPage } from 'next';
import handler from 'next-saas';

type Props = {
  foo: string;
  bar: string;
  baz?: string;
};

type Query = never;

type Body = {
  baz: string;
};

export const getServerSideProps = handler<Props, Query, Body>({
  loader() {
    return { foo: '123', bar: '456' };
  },
  async action({ req }) {
    return { foo: '123', bar: '456', baz: req.body.baz };
  },
});

const GSSP: NextPage<Props> = (props) => {
  return (
    <Fragment>
      <strong>gSSP Props:</strong>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Fragment>
  );
};

export default GSSP;
