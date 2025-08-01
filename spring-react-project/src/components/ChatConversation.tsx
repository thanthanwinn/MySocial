import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getLoggedInUserName, getUserId } from '../service/auth.service';
import { CreateMessageDto, MessageDto } from '../ds/dto';
import { getConversation } from '../service/message.service';

const ChatConversation: React.FC = () => {
    const userId = parseInt(getUserId() || "0");
    const { friendId } = useParams<{ friendId: string }>();
    const { state } = useLocation();
    const username = state?.username || 'Unknown';

    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const stompClient = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const subscriptionRef = useRef<string | null>(null);

    useEffect(() => {
        if (!friendId || userId === 0) {
            console.warn("Missing friendId or userId, aborting WebSocket connection setup.");
            return;
        }

        // Fetch old messages
        getConversation(parseInt(friendId))
            .then((res) => {
                setMessages(res.data);
                console.log("Fetched old messages:", res.data);
            })
            .catch((e) => {
                console.error('Failed to fetch conversation:', e);
            });

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            debug: (str) => {
                console.log('STOMP Debug: ' + str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket. Authenticated as:', getLoggedInUserName());
                console.log('User ID:', userId);
                console.log('Chatting with friend ID:', friendId);

                // Subscribe to user-specific queue
                subscriptionRef.current = client.subscribe('/user/queue/messages', (message) => {
                    try {
                        const receivedMessageDto: MessageDto = JSON.parse(message.body);
                        console.log('Received message:', receivedMessageDto);
                        setMessages((prev) => [...prev, receivedMessageDto]);
                    } catch (e) {
                        console.error("Error parsing received message body:", e);
                        console.log("Raw message body:", message.body);
                    }
                }).id;

                console.log('Subscribed to:', '/user/queue/messages');
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                console.error('Details:', frame.body);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
        });

        stompClient.current = client;
        client.activate();

        return () => {
            console.log('Deactivating STOMP client...');
            if (stompClient.current?.connected && subscriptionRef.current) {
                client.unsubscribe(subscriptionRef.current);
                console.log('Unsubscribed from /user/queue/messages');
            }
            client.deactivate();
        };
    }, [friendId, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!inputMessage.trim()) return;

        if (stompClient.current?.connected && friendId) {
            const messagePayload: CreateMessageDto = {
                content: inputMessage,
                receiverId: Number(friendId),
            };

            stompClient.current.publish({
                destination: '/app/send-message',
                body: JSON.stringify(messagePayload),
            });

            console.log('Sent message:', messagePayload);
            setInputMessage('');
        } else {
            console.warn("STOMP client not connected or friendId is missing. Message not sent.");
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
                                wordWrap: 'break-word',
                            }}
                        >
                            <strong>{msg.senderId || 'Unknown'}:</strong> {msg.content}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: 15, borderTop: '1px solid #ccc', display: 'flex' }}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
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