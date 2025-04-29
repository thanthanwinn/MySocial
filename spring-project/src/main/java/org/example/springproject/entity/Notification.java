package org.example.springproject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int userId; // The user who triggered the notification
    private int friendId; // The user who receives the notification
    private String type; // e.g., "FRIEND_REQUEST", "FOLLOW", "BLOCK"
    private String message; // Optional: Custom message
    private boolean isRead = false; // Whether the notification has been read
    private LocalDateTime createdAt = LocalDateTime.now();

}