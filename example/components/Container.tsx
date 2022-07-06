import { FC, ReactNode } from 'react';
import clsx from 'clsx';

export type Props = {
  className?: string;
  children: ReactNode;
};

export const Container: FC<Props> = ({ className, children }) => (
  <div className={clsx('mx-auto container sm:px-6 lg:px-8', className)}>{children}</div>
);
