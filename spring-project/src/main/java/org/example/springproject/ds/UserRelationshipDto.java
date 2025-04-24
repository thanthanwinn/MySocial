package org.example.springproject.ds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRelationshipDto {
    private int id;
    private String username;
    private String userDisplayName;
    private String relationType;
    private String relationStatus;
    private String img;
    private LocalDateTime createdAt;



}
