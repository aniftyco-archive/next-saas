import { FunctionComponent } from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

const Document: FunctionComponent = () => {
  return (
    <Html className="h-full">
      <Head />
      <body className="min-h-screen antialiased bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
