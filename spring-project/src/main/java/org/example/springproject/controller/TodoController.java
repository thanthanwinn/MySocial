package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.CreateTodoDto;
import org.example.springproject.ds.TodoListDto;
import org.example.springproject.entity.TodoList;
import org.example.springproject.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;
    @GetMapping("/get-list")
    public ResponseEntity<List<TodoListDto>> getTodos(@RequestHeader("X-User-Id") String userId) {
      var list =   todoService.findTodosById(Integer.parseInt(userId));
      return ResponseEntity.ok(list);
    }
    @PostMapping("/add-todo")
    public ResponseEntity addTodo(@RequestHeader("X-User-Id") String userId, @RequestBody CreateTodoDto todoListDto) {
        todoService.addTodo( Integer.parseInt(userId),todoListDto);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(@PathVariable("id") long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok("Deleted todo");
    }
    @PutMapping("/set-complete/{todoId}")
    public ResponseEntity<String> setTodoComplete(@PathVariable("todoId")long todoId) {
        todoService.setTodoComplete(todoId);
        return ResponseEntity.ok("Completed todo");
    }
    @PutMapping("/set-incomplete/{todoId}")
    public ResponseEntity<String> setTodoIncomplete(@PathVariable("todoId")long todoId) {
        todoService.setTodoIncomplete(todoId);
        return ResponseEntity.ok("Not Complete todo");
    }
}
