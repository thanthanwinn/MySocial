package org.example.springproject.ds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TodoListDto {
    private Long id;
    private int userId;
    private  String title;
    private LocalDateTime dueTime;
    private boolean completed;
}
