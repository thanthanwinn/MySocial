package org.example.springproject.ds;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PostDto {
    private Long id;
    private String content;
    private String authorName;
    private String authorDisplayName;
    private String img;
    private int authorId;
    private int likeCount;
    private Integer[] likedBy;
    private int commentCount;
    private LocalDateTime createdAt;
    private String visibility; // New field
    private boolean likedByCurrentUser;
}