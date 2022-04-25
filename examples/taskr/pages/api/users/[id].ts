import handler, { db, event } from 'next-saas';

type QueryParams = {
  id: string;
};

type UpdateUserInput = {
  name: string;
  email: string;
  password: string;
};

const doBackgroundWork = (timeout = 1000) => new Promise<void>((_) => setTimeout(_, timeout));

export default handler
  .get<QueryParams>(async ({ req }) => {
    await event.emit('background-work-started', new Date());
    doBackgroundWork().then(() => {
      event.emit('background-work-finished', new Date());
    });

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
