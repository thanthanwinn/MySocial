import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

interface Todo {
  id: number;
  task: string;
  time: string;
  completed: boolean;
}

export default function ToDoListComponent() {
  const { isDarkTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, task: "Complete React project", time: "3:00 PM", completed: false },
    { id: 2, task: "Study for exam", time: "5:00 PM", completed: false },
    { id: 3, task: "Prepare lunch", time: "12:00 PM", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.trim() || !newTime.trim()) return;
    const newTodo: Todo = {
      id: todos.length + 1,
      task: newTask,
      time: newTime,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setNewTask("");
    setNewTime("");
  };

  // Handle marking a task as completed
  const toggleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle deleting a task
  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div
      className={`shadow-md rounded-lg p-2 h-full ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">To-Do List</h2>

      {/* Add New Task */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          <input
            type="text"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`flex-1 px-0 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              isDarkTheme
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-white border-gray-300 focus:ring-blue-400"
            }`}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className={`px-0 py-2 rounded-md border focus:outline-none focus:ring-2 ${
              isDarkTheme
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-white border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>
        <button
          onClick={handleAddTask}
          className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available.</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-md shadow-sm ${
                isDarkTheme
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="w-5 h-5"
                />
                <div>
                  <p
                    className={`text-sm ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.task}
                  </p>
                  <p className="text-xs text-gray-400">{todo.time}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}