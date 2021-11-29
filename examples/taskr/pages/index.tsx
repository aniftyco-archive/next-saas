import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { HelloWorld } from 'components/HelloWorld';
import socketClient from 'socket.io-client';

const IndexPage = () => {
  const [message, setMessage] = useState('Welcome to your Next SaaS Starter Site!');

  useEffect(() => {
    const socket = socketClient();

    socket.on('message', setMessage);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Next SaaS Starter</title>
      </Head>
      <HelloWorld>{message}</HelloWorld>
    </Fragment>
  );
};

export default IndexPage;
