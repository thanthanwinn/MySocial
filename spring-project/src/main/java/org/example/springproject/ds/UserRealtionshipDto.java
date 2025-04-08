package org.example.springproject.ds;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
public class UserRealtionshipDto {
    private int id;
    private String username;
    private String userDisplayName;
    private String relationType;
    private String userImage;
    private LocalDateTime createdAt;

    public UserRealtionshipDto(int id, String username, String userDisplayName, String relationType, String userImage, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.userDisplayName = userDisplayName;
        this.relationType = relationType;
        this.userImage = userImage;
        this.createdAt = createdAt;
    }
}
