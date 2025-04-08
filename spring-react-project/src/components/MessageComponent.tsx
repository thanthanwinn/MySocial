import React, { useState, useEffect } from "react";
import { sendMessage, fetchConversation, fetchInbox } from "../service/user.service";
import { CreateMessageDto, MessageDto } from "../ds/dto";

export default function MessagesComponent() {
  const [inbox, setInbox] = useState<MessageDto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [conversation, setConversation] = useState<MessageDto[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchInbox()
      .then((res) => setInbox(res.data))
      .catch((err) => console.error("Failed to fetch inbox:", err));
  }, []);

  const loadConversation = (userId: number) => {
    setSelectedUserId(userId);
    fetchConversation(userId)
      .then((res) => setConversation(res.data))
      .catch((err) => console.error("Failed to fetch conversation:", err));
  };

  const handleSendMessage = () => {
    if (!selectedUserId) return;
    const messageDto: CreateMessageDto = { content: newMessage };
    sendMessage(selectedUserId, messageDto)
      .then((res) => {
        setConversation([...conversation, res.data]);
        setNewMessage("");
      })
      .catch((err) => console.error("Failed to send message:", err));
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Inbox Sidebar */}
      <div className="w-1/3 pr-4">
        <h2 className="text-xl font-bold mb-4">Inbox</h2>
        {inbox.map((msg) => (
          <div
            key={msg.id}
            className="card p-2 mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => loadConversation(msg.senderId === parseInt(getUserId() || "0") ? msg.receiverId : msg.senderId)}
          >
            <div className="font-bold">{msg.senderName}</div>
            <div className="truncate">{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Conversation */}
      <div className="w-2/3">
        {selectedUserId ? (
          <>
            <h2 className="text-xl font-bold mb-4">Conversation</h2>
            <div className="chat-container h-96 overflow-y-auto mb-4">
              {conversation.map((msg) => (
                <div key={msg.id} className={msg.senderId === parseInt(getUserId() || "0") ? "chat chat-end" : "chat chat-start"}>
                  <div className="chat-header">{msg.senderName}</div>
                  <div className="chat-bubble">{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="input input-bordered w-full mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a conversation to start messaging</p>
        )}
      </div>
    </div>
  );
}