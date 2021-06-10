import handler, { prisma } from 'next-saas';

export default handler
  .get(async () => {
    return prisma.user.findMany();
  })
  .post(async ({ req }) => {
    return prisma.user.create({ data: req.body });
  });
