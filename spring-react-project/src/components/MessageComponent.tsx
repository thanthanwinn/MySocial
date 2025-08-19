import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInbox } from '../service/message.service';
import { ChatListDto } from '../ds/dto';

const MessagingInbox: React.FC = () => {
  const [chatList, setChatList] = useState<ChatListDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getInbox()
      .then((res) => setChatList(res.data))
      .catch((e) => console.error(e));
  }, []);


  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 30 }}>
      <h2 style={{ textAlign: 'center' }}>Inbox</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden' }}>
        {chatList.map((chat) => (
          <div
            key={chat.friendId}
            onClick={() =>
              navigate(`/chat/${chat.friendId}`, { state: { username: chat.username ,  img: chat.img,
                isActive: true} })
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 12,
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              backgroundColor: '#fff',
              transition: '0.3s',
            }}
          >
            <img
              src={chat.img}
              alt="user"
              width="50"
              height="50"
              style={{ borderRadius: '50%', marginRight: 15 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{chat.username}</strong>
                <span style={{ fontSize: 12, color: '#888' }}>{chat.sentAt}</span>
              </div>
              <p style={{ margin: 0, color: '#555', fontSize: 14 }}>{chat.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagingInbox;
