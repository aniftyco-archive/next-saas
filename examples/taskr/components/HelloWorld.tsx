import { FunctionComponent } from 'react';

export const HelloWorld: FunctionComponent = ({ children }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="p-3 text-lg font-bold text-white bg-purple-700 rounded-lg md:text-2xl">{children}</h2>
  </div>
);
