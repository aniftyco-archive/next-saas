import { FC } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/solid';
import { Container } from './Container';

export type Feature = {
  name: string;
  description: string;
};

const features: Feature[] = [
  {
    name: '30-second checks',
    description:
      "We offer 30 seconds checks for all your websites. This allows us to let you know when your website goes down 10 times faster than other tools. Know within seconds when there's a problem so you can take immediate action.",
  },
  {
    name: 'Public status pages',
    description:
      "All plans get a multi-language status page per website. All the important website data on a single page. You decide if it's public or private.",
  },
  {
    name: 'The plan that fits your needs',
    description:
      'Stop guessing what your best important websites are, and track all websites. We offer quality monitoring for affordable pricing, powerful notifications and beautiful status pages.',
  },
  {
    name: 'Bring the whole team',
    description:
      'e understand how important it is to have a full access with your whole team. Give your entire team access to your metrics while keeping admin access.',
  },
];
export const Features: FC = () => (
  <section id="features" className="pt-20 pb-28">
    <Container>
      <div className="text-center">
        <h2 className="text-base font-semibold leading-8 tracking-wide text-red-600 uppercase">Why Monitoro?</h2>
        <p className="mt-4 text-xl">It&apos;s for people who just want to know if their site is on or offline.</p>
      </div>
      <div className="mt-12">
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <dt>
                <div className="absolute flex items-center justify-center w-12 h-12 text-white bg-red-500 rounded-md">
                  <CheckIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">{feature.name}</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  </section>
);
