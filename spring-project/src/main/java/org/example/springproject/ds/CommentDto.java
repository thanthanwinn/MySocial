package org.example.springproject.ds;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private int authorId;
    private  String authorName;
    private String authorDisplayName;
    private Long postId;
    private String img;
}
