package org.example.springproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class TodoList {
    @Id
    @GeneratedValue
    private Long id;

    private int userId;

    private String title;

    private boolean completed = false;

    private LocalDateTime dueTime;


}
