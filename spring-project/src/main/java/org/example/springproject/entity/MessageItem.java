package org.example.springproject.entity;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.MessageDao;
import org.example.springproject.dao.NotificationDao;
import org.example.springproject.dao.UserDao;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@RequiredArgsConstructor
public class MessageItem {

    private final MessageDao messageDao;
    private final UserDao userDao;

    public List<Message> messageCart = new ArrayList<>();
    public void addToCart(Message message) {
        messageCart.add(message);
    }
    public void clearCart(int friendId){
        List<Message> messages = messageDao.findByReceiverOrderBySentAtDesc(userDao.findUserById(friendId).get());
        System.out.println("notifications: " + messages);
        messageCart.removeAll(messages);
    }
    public int getMessageCount(int id){
        List<Message> yourNoti =  messageCart.stream()
                .filter(message -> message.getReceiver().getId() == id)
                .collect(Collectors.toUnmodifiableList());
        return yourNoti.size();
    }
}
