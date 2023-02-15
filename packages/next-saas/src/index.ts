import { NextPage } from 'next';
import { Jsonify } from 'type-fest';

export * from './api-handler';
export * from './errors';
export * as mailer from './mailer';
export { prisma as db } from './prisma';
export * as event from './event';
export { default } from './api-handler';
export { redirect, notFound } from './runtime';

export type { InferProps } from './runtime';

export type Page<Props = {}, IP = {}> = NextPage<Jsonify<Props>, IP>;

export * as log from 'next/dist/build/output/log';
