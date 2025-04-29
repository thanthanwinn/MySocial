package org.example.springproject.entity;

import lombok.*;
import org.example.springproject.dao.NotificationDao;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Getter
@Setter
@RequiredArgsConstructor
public class NotificationItem {
    private final NotificationDao notificationDao;

    public Set<Notification> notificationsCart = new HashSet<>();
    public void addToCart(Notification notification) {
        notificationsCart.add(notification);
    }
    public void clearCart(int friendId){
        List<Notification> notifications = notificationDao.findByFriendId(friendId);
        System.out.println("notifications: " + notifications);
        notificationsCart.removeAll(notifications);
    }
    public int getNotificationCount(int id){
          List<Notification> yourNoti =  notificationsCart.stream()
                .filter(notification -> notification.getFriendId() == id)
                .collect(Collectors.toUnmodifiableList());
          return yourNoti.size();
    }

}
