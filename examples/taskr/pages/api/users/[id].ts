import handler, { db } from 'next-saas';

export default handler
  .get<{ id: string }>(async ({ req }) => {
    return db.user.findFirst({
      where: { id: req.query.id },
    });
  })
  .patch<{ id: string }>(async ({ req }) => {
    return db.user.update({
      where: { id: req.query.id },
      data: req.body,
    });
  })
  .delete<{ id: string }>(async ({ req }) => {
    return db.user.delete({ where: { id: req.query.id } });
  });
