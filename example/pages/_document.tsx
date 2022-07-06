import { FC } from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

const Document: FC = () => {
  return (
    <Html className="h-full antialiased bg-white scroll-smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
      </Head>
      <body className="flex flex-col h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
