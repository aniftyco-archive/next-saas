import { FC } from 'react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { AppProps as Props } from 'next/app';
import 'tailwindcss/tailwind.css';

const App: FC<Props> = ({ Component, pageProps }) => (
  <ThemeProvider defaultTheme="light" attribute="class">
    <DefaultSeo
      titleTemplate="%s | Monitoro"
      defaultTitle="Monitoro - Monitor your websites 24/7/365"
      description="Get notified by the simplest uptime monitoring service in the world."
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://example.com/',
        site_name: 'Monitoro',
      }}
      twitter={{
        handle: '@example',
        site: '@example',
        cardType: 'summary_large_image',
      }}
    />
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
