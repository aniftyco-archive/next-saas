import { FC } from 'react';

export const CallToAction: FC = () => (
  <section className="bg-red-700">
    <div className="max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
        <span className="block">Ready to monitor some websites?</span>
      </h2>
      <p className="mt-4 text-lg leading-6 text-red-200">
        Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla nec.
      </p>
      <a
        href="#"
        className="inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium text-red-600 bg-white border border-transparent rounded-md hover:bg-red-50 sm:w-auto"
      >
        Get started today
      </a>
    </div>
  </section>
);
