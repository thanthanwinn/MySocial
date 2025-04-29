package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.NotificationDto;
import org.example.springproject.entity.Notification;
import org.example.springproject.entity.NotificationItem;
import org.example.springproject.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationItem notificationItem;

    private final NotificationService notificationService;
    @GetMapping("/clear/{userId}")
    public void clearNotifications (@RequestHeader("X-User-Id")String userId) {

        notificationItem.clearCart(Integer.parseInt(userId));
    }


    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
    @GetMapping("/count")
    public int getNotificationCount(@RequestHeader("X-User-Id") String userId) {
       return notificationItem.getNotificationCount(Integer.parseInt(userId));
    }

    @GetMapping
    public List<NotificationDto> getNotifications(@RequestHeader("X-User-Id") int userId) {
        return notificationService.getNotifications(userId);
    }

}