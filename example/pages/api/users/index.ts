import handler, { db } from 'next-saas';
import bcrypt from 'bcrypt';
import requestId from '@app/middleware/request-id';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export default handler
  .use(requestId())
  .get(async () => {
    return db.user.findMany();
  })
  .post<CreateUserInput>(async ({ req }) => {
    const data = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    };

    return db.user.create({ data });
  });
