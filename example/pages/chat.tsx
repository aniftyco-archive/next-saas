import { useEffect, useState } from 'react';
import { Page } from 'next-saas';

const ChatPage: Page = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const chat = new EventSource('/api/chat', { withCredentials: true });

    const onOpen = (e: EventSourceEventMap['open']) => {
      console.log('connected');
    };

    const onMessage = (e: EventSourceEventMap['message']) => {
      const data = JSON.parse(e.data);
      setMessages((messages) => [data.message, ...messages]);
    };

    const onError = (e: EventSourceEventMap['error']) => {
      console.error('error', e);
    };

    chat.addEventListener('open', onOpen);
    chat.addEventListener('error', onError);
    chat.addEventListener('message', onMessage);

    return () => {
      chat.removeEventListener('open', onOpen);
      chat.removeEventListener('error', onError);
      chat.removeEventListener('message', onMessage);
      chat.close();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(() => {
      setMessage('');
    });
  };

  return (
    <div className="container max-w-lg mx-auto border border-red-600">
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <form method="post" className="flex" onSubmit={handleSubmit}>
        <input type="text" className="" onChange={({ target }) => setMessage(target.value)} value={message} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChatPage;
