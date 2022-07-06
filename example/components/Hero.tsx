import { FC } from 'react';
import Link from 'next/link';
import { Container } from './Container';

export const Hero: FC = () => (
  <Container className="pt-20 pb-16 text-center">
    <h1 className="max-w-6xl mx-auto font-medium tracking-tight text-7xl font-display text-slate-800">
      Monitoring <span className="text-red-600">made simple</span>
      <br /> for small businesses.
    </h1>
    <p className="max-w-2xl mx-auto my-12 text-xl text-slate-700">
      Get notified by the simplest uptime monitoring service in the world.
    </p>
    <Link href="/register">
      <a className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-full bg-slate-900 focus:outline-none hover:text-slate-100 hover:bg-slate-700 active:bg-slate-800 active:text-slate-100">
        Start 2 week free trial
      </a>
    </Link>
  </Container>
);
