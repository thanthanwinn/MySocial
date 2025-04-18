package org.example.springproject.aspect;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.example.springproject.service.NotificationService;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class NotificationAspect {

    private final NotificationService notificationService;

    @AfterReturning("execution(* org.example.springproject.service.RelationsService.sendFriendRequest(..)) && args(senderId, receiverId)")
    public void afterSendFriendRequest(Long senderId, Long receiverId) {
        notificationService.createNotification(senderId, receiverId, "FRIEND_REQUEST", "You have a new friend request.");
    }

    @AfterReturning("execution(* org.example.springproject.service.RelationsService.acceptFriendRequest(..)) && args(senderId, receiverId)")
    public void afterAcceptFriendRequest(Long senderId, Long receiverId) {
        notificationService.createNotification(senderId, receiverId, "FRIEND_ACCEPTED", "Your friend request has been accepted.");
    }

    @AfterReturning("execution(* org.example.springproject.service.RelationsService.follow(..)) && args(senderId, receiverId)")
    public void afterFollow(Long senderId, Long receiverId) {
        notificationService.createNotification(senderId, receiverId, "FOLLOW", "You have a new follower.");
    }

    @AfterReturning("execution(* org.example.springproject.service.RelationsService.block(..)) && args(senderId, receiverId)")
    public void afterBlock(Long senderId, Long receiverId) {
        notificationService.createNotification(senderId, receiverId, "BLOCK", "You have been blocked.");
    }
}
