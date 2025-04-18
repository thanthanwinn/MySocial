package org.example.springproject.ds;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserRelationDto {
    private int id;
    private String username;
    private String relationType;
    private String relationStatus;
    private LocalDateTime createdAt;

    public UserRelationDto(int id, String username, String relationType,String relationStatus, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.relationType = relationType;
        this.relationStatus = relationStatus;
        this.createdAt = createdAt;
    }
}