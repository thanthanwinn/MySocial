package org.example.springproject.ds;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.springproject.entity.Message;

import java.time.LocalDateTime;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private int senderId;
    private String senderName;
    private int receiverId;
    private String receiverName;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;

    public static MessageDto fromMessage(Message message) {
        return MessageDto
                .builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getUsername())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getUsername())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .isRead(message.isRead())
                .build();
    }
}
