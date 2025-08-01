package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.MessageDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.ChatListDto;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.ds.UserInfoDto;
import org.example.springproject.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageDao messageDao;
    private final UserDao userDao;
    @Transactional
    public Message createMessage(CreateMessageDto createMessageDto,int senderId) {
        System.out.println(createMessageDto.getReceiverId() + "receier Id: " + createMessageDto.getReceiverId());
        Message message = new Message();
        message.setContent(createMessageDto.getContent());
        message.setReceiver(userDao.findUserById(createMessageDto.getReceiverId()).get());
        message.setSender(userDao.findUserById(senderId).get());
        message.setSentAt(LocalDateTime.now());
        return messageDao.save(message);
    }
    public List<ChatListDto> getInboxes(int userId){
        return messageDao.getChatListByUserId(userId);
    }


    public List<MessageDto> getMessagesByUser(int userId, int friendId) {
        User user = userDao.findUserById(userId).get();
        User friend = userDao.findUserById(friendId).get();
        List<Message> messages = messageDao.findConversationBetween(friend, user);
        return messages.stream()
                .map(m -> convertMessageDto(m))
                .collect(Collectors.toUnmodifiableList());

    }
    public MessageDto convertMessageDto(Message message) {
        MessageDto messageDto = new MessageDto();
        messageDto.setContent(message.getContent());
        messageDto.setId(message.getId());
        messageDto.setRead(false);
        messageDto.setSentAt(message.getSentAt());
        messageDto.setSenderId(message.getSender().getId());
        messageDto.setReceiverId(message.getReceiver().getId());
        return messageDto;

    }




}
