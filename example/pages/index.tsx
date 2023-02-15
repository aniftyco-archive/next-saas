import { Fragment } from 'react';
import { Page } from 'next-saas';
import { NextSeo } from 'next-seo';
import { CallToAction } from '@app/components/CallToAction';
import { Faqs } from '@app/components/Faqs';
import { Features } from '@app/components/Features';
import { Footer } from '@app/components/Footer';
import { Header } from '@app/components/Header';
import { Hero } from '@app/components/Hero';
import { Pricing } from '@app/components/Pricing';

const IndexPage: Page = () => {
  return (
    <Fragment>
      <NextSeo title="Monitor your websites 24/7/365" />
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </Fragment>
  );
};

export default IndexPage;
