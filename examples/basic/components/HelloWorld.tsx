import { FunctionComponent } from 'react';

export const HelloWorld: FunctionComponent = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="p-3 text-lg text-white font-bold bg-purple-700 md:text-2xl rounded-lg">
      Hi! Welcome to your first Next.js &amp; Tailwind CSS site.
    </h2>
  </div>
);
