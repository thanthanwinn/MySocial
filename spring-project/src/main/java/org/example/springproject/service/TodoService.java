package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.TodoDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.CreateTodoDto;
import org.example.springproject.ds.TodoListDto;
import org.example.springproject.entity.TodoList;
import org.example.springproject.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final  TodoDao todoDao;
    private final RelationsService relationsService;

    public List<TodoListDto> findTodosById(int userId){
       return todoDao.findByUserId(userId).get()
               .stream()
               .map(t -> convertTodoListDto(userId,t))
               .collect(Collectors.toList());
    }

    public void addTodo(int userId, CreateTodoDto todoListDto){
        TodoList todo = new TodoList();
        todo.setUserId(userId);
        todo.setDueTime(todoListDto.getDueTime());
        todo.setTitle(todoListDto.getTitle());
        todo.setCompleted(todoListDto.isCompleted());
        todoDao.save(todo);
    }
    public void deleteTodo(Long todoId){
        todoDao.deleteById(todoId);
    }
    public void setTodoComplete(Long todoId){
       TodoList todo =  todoDao.findById(todoId).orElseThrow();
       todo.setCompleted(true);
       todoDao.save(todo);
    }

    public void setTodoIncomplete(Long todoId){
        TodoList todo = todoDao.findById(todoId).orElseThrow();
        todo.setCompleted(false);
        todoDao.save(todo);
    }
    public TodoListDto convertTodoListDto(int userId,TodoList todoList){
        TodoListDto todoListDto = new TodoListDto();
        todoListDto.setUserId(userId);
        todoListDto.setTitle(todoList.getTitle());
        todoListDto.setDueTime(todoList.getDueTime());
        todoListDto.setCompleted(todoList.isCompleted());
        todoListDto.setId(todoList.getId());
        return todoListDto;

    }
}
