import { FC } from 'react';
import { ArrowCircleUpIcon } from '@heroicons/react/solid';

export type Props = {
  className?: string;
};

export const Logo: FC<Props> = ({ className }) => <ArrowCircleUpIcon className={className} />;
