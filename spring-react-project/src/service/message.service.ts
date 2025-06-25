import axios from 'axios';
import { ChatListDto, CreateMessageDto, MessageDto } from '../ds/dto';

const BASE_URL = 'http://localhost:8080/api/messages';

export const sendMessage = (receiverId: number, messageDto: CreateMessageDto) => {
  return axios.post<MessageDto>(`${BASE_URL}/send/${receiverId}`, messageDto, {
    headers: {
      'X-User-Id': localStorage.getItem('userId') || '',
    },
  });
};

export const getConversation = (otherUserId: number) => {
  return axios.get<MessageDto[]>(`${BASE_URL}/conversation/${otherUserId}`, {
    headers: {
      'X-User-Id': localStorage.getItem('userId') || '',
    },
  });
};

export const getInbox = () => {
  return axios.get<ChatListDto[]>(`${BASE_URL}/inbox`, {
    headers: {
      'X-User-Id': localStorage.getItem('userId') || '',
    },
  });
};
