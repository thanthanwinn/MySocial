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
    private static final Logger log = LoggerFactory.getLogger(MessageService.class);
    private final MessageDao messageDao;
    private final UserDao userDao;
    private final RelationsService relationsService;
    private final NotificationService notificationService;

    @Transactional
    public MessageDto sendMessage(int senderId, int receiverId, CreateMessageDto messageDto) {
        User sender = userDao.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userDao.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Check if messaging is allowed
        Relations relation = relationsService.getExistingRelation(senderId, receiverId);
        Relations reverseRelation = relationsService.getExistingRelation(receiverId, senderId);
        if (reverseRelation != null && reverseRelation.getType() == RelationType.BLOCKED) {
            throw new SecurityException("You are blocked by " + receiver.getUsername());
        }
        if (relation == null || (relation.getType() != RelationType.FOLLOW && relation.getType() != RelationType.ACCEPTED)) {
            throw new SecurityException("You must be following or friends with " + receiver.getUsername() + " to send a message");
        }

        Message message = new Message(sender, receiver, messageDto.getContent());
        Message savedMessage = messageDao.save(message);

        // Send notification


        return convertToDto(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getConversation(int userId, int otherUserId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User otherUser = userDao.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        return messageDao.findBySenderAndReceiverOrderBySentAtAsc(user, otherUser)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getInbox(int userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageDao.findByReceiverOrderBySentAtDesc(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private MessageDto convertToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getUsername());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getUsername());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setRead(message.isRead());
        return dto;
    }
}