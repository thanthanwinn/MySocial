package org.example.springproject.ds;

import lombok.Data;
import org.example.springproject.entity.NotificationType;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;

    private int senderId; // The user who triggered the notification
    private int receiverId; // The user who receives the notification
    private String type; // e.g., "FRIEND_REQUEST", "FOLLOW", "BLOCK"
    private String message; // Optional: Custom message
    private boolean isRead = false; // Whether the notification has been read
    private LocalDateTime createdAt = LocalDateTime.now();
}