package org.example.springproject.ds;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatListDto {
    private  int friendId;
    private String username;
    private String img;
    private String content;
    private LocalDateTime sentAt;

    public ChatListDto(int userId, String username, String img, String content, LocalDateTime sentAt) {
        this.friendId = userId;
        this.username = username;
        this.img = img;
        this.content = content;
        this.sentAt = sentAt;
    }
}
