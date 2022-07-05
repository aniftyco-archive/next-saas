import { Fragment, FunctionComponent } from 'react';
import { NextSeo } from 'next-seo';
import { HelloWorld } from '@app/components/HelloWorld';

const IndexPage: FunctionComponent = () => (
  <Fragment>
    <NextSeo title="Welcome!" />
    <HelloWorld />
  </Fragment>
);

export default IndexPage;
