import { FC } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Logo } from './Logo';

const navigation = [
  { anchor: 'Features', href: '#features' },
  { anchor: 'FAQ', href: '#faq' },
  { anchor: 'Pricing', href: '#pricing' },
];

export const Header: FC = () => (
  <header className="py-10">
    <Container>
      <nav className="text-base">
        <ul className="flex items-center">
          <li>
            <Link href="/">
              <a className="flex items-center space-x-1 text-red-600">
                <Logo className="w-auto h-8" />
                <span className="text-lg font-semibold">Monitoro</span>
              </a>
            </Link>
          </li>
          <li className="ml-12">
            <Link href={navigation[0].href}>
              <a className="px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                {navigation[0].anchor}
              </a>
            </Link>
          </li>
          {navigation.slice(1, navigation.length[-1]).map((link) => (
            <li key={link.anchor} className="ml-6">
              <Link href={link.href}>
                <a className="px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                  {link.anchor}
                </a>
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link href="/register">
              <a className="px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">Sign in</a>
            </Link>
          </li>
          <li className="ml-8">
            <Link href="/register">
              <a className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-full focus:outline-none hover:text-slate-100 hover:bg-red-500 active:bg-red-800 active:text-red-100">
                Get started today
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </Container>
  </header>
);
