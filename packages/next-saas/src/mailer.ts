import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import { convert } from 'html-to-text';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { resolve } from 'path';

export type Address = {
  name: string;
  address: string;
};

export type Recipient = string | string[] | Address | Address[];

export type SendParams<Values = Record<string, any>> = {
  template: string;
  values?: Values;
  subject: string;
  from?: Recipient;
  to: Recipient;
  cc?: Recipient;
  replyTo?: Recipient;
};

export const send = async <Values>({
  template,
  values,
  from = process.env.MAIL_FROM || process.env.MAIL_USER,
  ...envelope
}: SendParams<Values>) => {
  const transport = {
    host: process.env.MAIL_HOST,
    port: (process.env.MAIL_PORT || 587) as number,
    secure: Boolean(process.env.MAIL_SECURE || false),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  try {
    const tpl = await readFile(resolve(process.cwd(), template), 'utf-8');
    const html = compile(tpl)(values);
    const result = await nodemailer.createTransport(transport).sendMail({
      ...envelope,
      from,
      html,
      text: convert(html),
    } as SendMailOptions);

    return result;
  } catch (err) {
    throw err;
  }
};
