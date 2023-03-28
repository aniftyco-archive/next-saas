import { Seeder } from 'next-saas';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

const seeder: Seeder<User> = async ({ db }) => {
  return db.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: await bcrypt.hash('hunter2', 12),
    },
  });
};

export default seeder;
