import { FC } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/solid';
import clsx from 'clsx';

export type Tier = {
  title: string;
  slug: string;
  price: number;
  description: string;
  features: string[];
  mostPopular: boolean;
};

const tiers: Tier[] = [
  {
    title: 'Freelancer',
    slug: 'freelancer',
    price: 24,
    description: 'The essentials to provide your best monitoring for clients.',
    features: ['5 monitors', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
    mostPopular: false,
  },
  {
    title: 'Startup',
    slug: 'startup',
    price: 32,
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 monitors',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Notification automations',
    ],
    mostPopular: true,
  },
  {
    title: 'Enterprise',
    slug: 'enterprise',
    price: 48,
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited monitors',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time',
      'Notification automations',
      'Custom integrations',
    ],
    mostPopular: false,
  },
];

export const Pricing: FC = () => (
  <section id="pricing" className="px-4 py-24 mx-auto bg-white max-w-7xl sm:px-6 lg:px-8">
    <h2 className="text-6xl font-extrabold tracking-tight text-center text-slate-900 font-display">
      Pricing plans for teams of all sizes
    </h2>
    <p className="max-w-2xl mx-auto mt-6 text-xl text-slate-500">
      Choose an affordable plan that&apos;s packed with the best features for engaging your audience, creating customer
      loyalty, and driving sales.
    </p>

    {/* Tiers */}
    <div className="mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
      {tiers.map((tier) => (
        <div
          key={tier.title}
          className="relative flex flex-col p-8 bg-white border shadow-sm border-slate-200 rounded-2xl"
        >
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">{tier.title}</h3>
            {tier.mostPopular ? (
              <p className="absolute top-0 py-1.5 px-4 bg-red-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
                Most popular
              </p>
            ) : null}
            <p className="flex items-baseline mt-4 text-slate-900">
              <span className="text-5xl font-extrabold tracking-tight">${tier.price}</span>
              <span className="ml-1 text-xl font-semibold">/month</span>
            </p>
            <p className="mt-6 text-slate-500">{tier.description}</p>

            {/* Feature list */}
            <ul role="list" className="mt-6 space-y-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex">
                  <CheckIcon className="flex-shrink-0 w-6 h-6 text-red-500" aria-hidden="true" />
                  <span className="ml-3 text-slate-500">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={{ pathname: '/register', query: { tier: tier.slug } }}>
            <a
              className={clsx(
                'mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium',
                {
                  'bg-red-500 text-white hover:bg-red-600': tier.mostPopular,
                  'bg-red-50 text-red-700 hover:bg-red-100': !tier.mostPopular,
                }
              )}
            >
              Get started today
            </a>
          </Link>
        </div>
      ))}
    </div>
  </section>
);
