import handler, { db } from 'next-saas';
import bcrypt from 'bcrypt';

export default handler
  .get(async () => {
    return db.user.findMany();
  })
  .post<any, { name: string; email: string; password: string }>(async ({ req }) => {
    const data = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    };

    return db.user.create({ data });
  });
