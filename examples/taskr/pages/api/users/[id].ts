import handler, { db } from 'next-saas';

type QueryParams = {
  id: string;
};

type UpdateUserInput = {
  name: string;
  email: string;
  password: string;
};

export default handler
  .get<QueryParams>(async ({ req }) => {
    return db.user.findFirst({
      where: { id: req.query.id },
    });
  })
  .patch<UpdateUserInput, QueryParams>(async ({ req }) => {
    return db.user.update({
      where: { id: req.query.id },
      data: req.body,
    });
  })
  .delete<QueryParams>(async ({ req }) => {
    return db.user.delete({ where: { id: req.query.id } });
  });
