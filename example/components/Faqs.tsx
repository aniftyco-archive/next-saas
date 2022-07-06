import { FC } from 'react';

export type Faq = { question: string; answer: string };

const faqs: Faq[] = [
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
  {
    question: 'Lorem ipsum dolor sit amet',
    answer:
      'nteger fermentum pharetra lacus, id ultricies risus cursus eget. Vivamus id orci sit amet libero vestibulum condimentum at eu libero. Ut vel efficitur lorem, non bibendum felis. Morbi dignissim ornare arcu, sit amet tristique eros finibus sed.',
  },
];

export const Faqs: FC = () => (
  <section id="faq">
    <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
      <h2 className="text-6xl font-extrabold tracking-tight text-center text-slate-900 font-display">
        Frequently Asked Questions
      </h2>
      <div className="mt-24">
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);
