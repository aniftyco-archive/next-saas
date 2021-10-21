import { resolve, join } from 'path';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import nodemailer, { SendMailOptions } from 'nodemailer';
import NodeMailer from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as log from 'next/dist/build/output/log';

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

export class Mailer {
  private transport: NodeMailer<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transport = nodemailer.createTransport(
      new SMTPTransport({
        host: process.env.MAIL_HOST,
        port: (process.env.MAIL_PORT || 587) as number,
        secure: Boolean(process.env.MAIL_SECURE || false),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      })
    );
  }

  private async render(view: string, values: Record<string, any> = {}) {
    console.log(global.__$NEXT_SAAS__.config);
    const template = await readFile(
      resolve(
        global.__$NEXT_SAAS__.config.mailer?.templates || resolve(global.__$NEXT_SAAS__.PWD, 'mailables'),
        `${view}.html`
      ),
      'utf-8'
    );
    console.log(template);
    const html = compile(template)(values);

    return {
      html,
      text: undefined,
    };
  }

  public async send<Values>({ template, values, from, ...envelope }: SendParams<Values>) {
    const { html, text } = await this.render(template, values);

    try {
      const { messageId } = await this.transport.sendMail({
        ...envelope,
        from: global.__$NEXT_SAAS__.config.mailer?.from || from,
        html,
        text,
      } as SendMailOptions);
      log.event(`email sent ${messageId}`);
    } catch (err) {
      throw err;
    }
  }
}

export const mailer = new Mailer();
