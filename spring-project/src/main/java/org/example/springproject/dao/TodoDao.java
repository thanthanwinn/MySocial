package org.example.springproject.dao;

import org.example.springproject.entity.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoDao extends JpaRepository<TodoList, Long> {
    Optional<List<TodoList>> findByUserId(int userId);
}
