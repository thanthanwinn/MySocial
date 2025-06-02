package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.MessageDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageDao messageDao;
    private final UserDao userDao;
    @Transactional
    public void createMessage(CreateMessageDto createMessageDto) {
        Message message = new Message();
        message.setContent(createMessageDto.getContent());
        message.setReceiver(userDao.findUserById(createMessageDto.getReciverId()).get());
        messageDao.save(message);
    }

    public List<MessageDto> getMessageByUser(int id) {
        User user = userDao.findUserById(id).get();
        List<Message> messages = messageDao.findByReceiverOrderBySentAtDesc(user);
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