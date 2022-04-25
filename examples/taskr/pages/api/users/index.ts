import handler, { db, event } from 'next-saas';
import bcrypt from 'bcrypt';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export default handler
  .get(async () => {
    await event.emit('get-users');
    return db.user.findMany();
  })
  .post<CreateUserInput>(async ({ req }) => {
    const data = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    };

    return db.user.create({ data });
  });
