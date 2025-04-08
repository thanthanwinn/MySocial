package org.example.springproject.ds;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RelationsDto {
    private Long id;
    private int senderId;
    private String senderName;
    private int recipientId;
    private String recipientName;
    private String status; // "PENDING", "ACCEPTED" etc.
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    }
