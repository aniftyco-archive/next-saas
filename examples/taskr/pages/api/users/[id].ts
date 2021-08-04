import handler, { db, log } from 'next-saas';

export default handler
  // .use(async (context, next) => {
  //   context.user = await db.user.findFirst();

  //   return next();
  // })
  .get<{ id: string }>(async ({ req, user }) => {
    log.event(JSON.stringify(user));
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
