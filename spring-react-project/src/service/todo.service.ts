import axios from "axios";
import { TodoDto } from "../ds/dto";

export const TODO_URL = "http://localhost:8080/api/todos";

export const getTodos = () =>
    axios.get<TodoDto[]>(`${TODO_URL}/get-list`);


export const createTodo = (todoDto: TodoDto) =>
    axios.post<TodoDto>(`${TODO_URL}/add-todo`, todoDto);

export const deleteTodo = (todoId: number) =>
    axios.delete(`${TODO_URL}/${todoId}`);

export const setCompleteTodo = (todoId: number) =>
    axios.put(`${TODO_URL}/set-complete/${todoId}`);

export const setIncompleteTodo = (todoId: number) =>
    axios.put(`${TODO_URL}/set-incomplete/${todoId}`);
        
