package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.NotificationDto;
import org.example.springproject.entity.Notification;
import org.example.springproject.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;



    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
    @GetMapping("/unread")
    public List<NotificationDto> getUnreadNotifications(@RequestHeader("X-User-Id") Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

}