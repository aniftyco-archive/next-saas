import { log } from 'next-saas';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

const messages = ['Howdy partner', 'What is up'];

export default ({ server }: { server: Server }) => {
  const io = new SocketServer(server);

  io.on('connection', (client) => {
    log.event('socket connection made', client.id);

    setInterval(() => client.emit('message', messages[Math.floor(Math.random() * messages.length)]), 10000);
  });
};
