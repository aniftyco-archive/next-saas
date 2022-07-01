import handler from 'next-saas';

export default handler.get(() => {
  return { status: 'OK' };
});
