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
public class CreateTodoDto {
    private  String title;
    private LocalDateTime dueTime;
    private boolean completed;
}
