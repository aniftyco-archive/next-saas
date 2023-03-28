import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import { join } from 'path';
import { prisma as db } from './prisma';

export type SeederContext = {
  db: PrismaClient;
};

export type Seeder<Model = any> = (ctx: SeederContext) => Promise<void> | Promise<Model>;

export type SeedRunner = Record<string, Seeder<any>>;

type SeedFile = {
  name: string;
  run: Seeder<any>;
};

const seedLoader = join(process.cwd(), 'db/seeds');

const seeder = async () => {
  const { default: seeds } = await import(seedLoader);
  console.log(`${chalk.cyan('ℹ')}   Seeding database...\n`);

  const seeders = await Promise.all(Object.entries(seeds).map(async ([name, run]) => ({ name, run } as SeedFile)));

  for (const seeder of seeders) {
    await seeder.run({ db });

    console.log(`${chalk.green('✔')}   Executed ${chalk.cyan(seeder.name)} seeder successfully.`);
  }
};

seeder()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    process.exit();
  });
