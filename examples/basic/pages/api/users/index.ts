import handler, { Middleware, UnauthorizedError, prisma } from 'next-saas';

const protect = (): Middleware => (ctx, next) => {
  if (!ctx.user) {
    throw new UnauthorizedError();
  }

  return next();
};

export default handler
  .use(protect())
  .get(async ({ user }) => {
    console.log(user);
    return prisma.user.findMany();
  })
  .post(async ({ req }) => {
    return prisma.user.create({ data: req.body });
  });
