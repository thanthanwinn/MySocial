package org.example.springproject.aspect;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.example.springproject.dao.UserDao;
import org.example.springproject.entity.Notification;
import org.example.springproject.entity.NotificationItem;
import org.example.springproject.entity.User;
import org.example.springproject.service.NotificationService;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class NotificationAspect {
    private final UserDao userDao;

    private final NotificationService notificationService;
    private final NotificationItem notificationItem;

    @After(value = "execution(* org.example.springproject.service.RelationsService.sendFriendRequest(..)) && args(userId, friendId)")
    public void afterSendFriendRequest(int userId, int friendId) {
       Notification notification = notificationService.createNotification(userId, friendId, "FRIEND_REQUEST", "You have a new friend request.");
        notificationItem.addToCart(notification);

    }

    @After("execution(* org.example.springproject.service.RelationsService.acceptFriendRequest(..)) && args(userId, friendId)")
    public void afterAcceptFriendRequest(int userId, int friendId) {
       Notification notification = notificationService.createNotification(userId, friendId, "FRIEND_ACCEPTED", "Your friend request has been accepted.");
        notificationItem.addToCart(notification);

    }

    @After("execution(* org.example.springproject.service.RelationsService.follow(..)) && args(followerId, followeeId)")
    public void afterFollow(int followerId, int followeeId) {
        User follower = userDao.findById(followeeId).get();
      Notification notification  =  notificationService.createNotification(followerId, followeeId, "FOLLOW",  follower.getProfile().getDisplayName() + " followed you");
      notificationItem.addToCart(notification);
    }

    @After("execution(* org.example.springproject.service.RelationsService.block(..)) && args(userId, friendId)")
    public void afterBlock(int userId, int friendId) {
       Notification notification = notificationService.createNotification(userId, friendId, "BLOCK", "You have been blocked.");
        notificationItem.addToCart(notification);

    }
}
