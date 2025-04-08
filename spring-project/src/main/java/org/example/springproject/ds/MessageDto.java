package org.example.springproject.ds;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto {
    private Long id;
    private int senderId;
    private String senderName;
    private int receiverId;
    private String receiverName;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;
}