import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getUserId } from '../service/auth.service';
import { CreateMessageDto, MessageDto } from '../ds/dto';
import { getConversation } from '../service/message.service';

const ChatConversation: React.FC = () => {
  const userId = getUserId();
  const { id } = useParams(); // friendId from URL
  const { state } = useLocation();
  const username = state?.username || 'Unknown';

  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        'X-User-Id': String(userId),
      },
      onConnect: () => {
        client.subscribe('/user/queue/messages', (message) => {
          const body: MessageDto = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
        },
      
    });
      getConversation(Number(id))
          .then((res) => {
              console.log(res.data);
          
          })
      .catch((e)=> console.log(e));

    stompClient.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  const sendMessage = () => {
    if (stompClient.current?.connected && id) {
      const message: CreateMessageDto = {
        content: inputMessage,
        receiverId: Number(id),
      };

      stompClient.current.publish({
        destination: '/backend/send-message',
        body: JSON.stringify(message),
        headers: {
          'X-User-Id': String(userId),
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          content: inputMessage,
          senderId: userId ? Number(userId) : 0,
          receiverId: Number(id),
          sentAt: new Date().toISOString(),
        } as MessageDto,
      ]);
      setInputMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', height: '90vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 15, borderBottom: '1px solid #ccc' }}>
        <h3>Chat with {username}</h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 15, background: '#f7f7f7' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.senderId === userId ? 'right' : 'left',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: 20,
                backgroundColor: msg.senderId === userId ? '#007bff' : '#ddd',
                color: msg.senderId === userId ? 'white' : 'black',
                maxWidth: '70%',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: 15, borderTop: '1px solid #ccc', display: 'flex' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10, borderRadius: 20, border: '1px solid #ccc' }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            borderRadius: 20,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatConversation;
