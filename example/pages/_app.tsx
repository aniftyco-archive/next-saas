import { FunctionComponent, useEffect } from 'react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { AppProps as Props } from 'next/app';
import { useRouter } from 'next/router';
import * as fathom from 'fathom-client';
import 'tailwindcss/tailwind.css';

const App: FunctionComponent<Props> = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    fathom.load(process.env.NEXT_PUBLIC_FATHOM_CODE, {
      includedDomains: [process.env.NEXT_PUBLIC_FATHOM_DOMAIN],
    });

    router.events.on('routeChangeComplete', fathom.trackPageview);

    return () => {
      router.events.off('routeChangeComplete', fathom.trackPageview);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <DefaultSeo
        titleTemplate="%s | Next-Saas App"
        defaultTitle="Next-Saas App"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://yourdomain.com/',
          site_name: 'Next-Saas App',
        }}
        twitter={{
          handle: '@yourtwitter',
          site: '@yourtwitter',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
