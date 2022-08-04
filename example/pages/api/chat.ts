import handler, { event } from 'next-saas';

export default handler
  .get(async ({ res }) => {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream;charset=utf-8',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });

    res.flushHeaders();

    res.write('event: message\n\n');

    event.on('message', (message) => {
      res.write(`data: ${message}\n\n`);
    });

    res.on('close', res.end);
    res.on('abort', res.end);
  })
  .post<{ message: string }>(async ({ req, res }) => {
    event.emit('message', JSON.stringify(req.body));

    res.writeHead(204);
    res.end();
  });
