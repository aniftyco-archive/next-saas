import handler, { prisma } from 'next-saas';

export default handler
  .get<{ id: string }>(async ({ req }) => {
    return prisma.user.findFirst({
      where: { id: req.query.id },
    });
  })
  .patch<{ id: string }>(async ({ req }) => {
    return prisma.user.update({
      where: { id: req.query.id },
      data: req.body,
    });
  });
