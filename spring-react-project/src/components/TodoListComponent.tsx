import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  getTodos,
  createTodo,
  deleteTodo,
  setCompleteTodo,
  setIncompleteTodo,
} from "../service/todo.service";
import { TodoDto } from "../ds/dto";

export default function ToDoListComponent() {
  const { isDarkTheme } = useTheme();
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const message = "we care your productivity and focus! 🚀";
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedDate) return;

    const formattedDate = selectedDate.toISOString().slice(0, 19);

    const newTodo: TodoDto = {
      title: newTask,
      dueTime: formattedDate,
      completed: false,
    };

    try {
      const response = await createTodo(newTodo);
      setTodos((prev) => [...prev, response.data]);
      setNewTask("");
      setSelectedDate(new Date());
      setShowDropdown(false);
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      if (completed) {
        await setIncompleteTodo(id);
      } else {
        await setCompleteTodo(id);
      }
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling completion status", error);
    }
  };


  return (
    <div className="flex justify-center items-start min-h-screen pt-10 px-4">
      <div
        className={`rounded-2xl p-6 w-full max-w-md mx-auto shadow-lg transition-all duration-300 ${
          isDarkTheme 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700" 
            : "bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 border border-blue-100"
        }`}
      >
        <div className="flex items-center justify-between mb-6 relative">
  {/* Logo with hover message */}
  <div className="relative group">
    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500 cursor-default">
      ✨ Priority Pulse
    </h2>
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <p className="margin-r-3 text-xs font-medium px-3 py-1 overflow-x-auto rounded-full bg-white/80 text-gray-800 shadow-sm whitespace-nowrap">
        {message}
      </p>
    </div>
  </div>

  {/* Add Task Button with Dropdown */}
  <div className="relative">
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 shadow-md ${
        isDarkTheme 
          ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white" 
          : "bg-gradient-to-r from-blue-400 to-sky-500 text-white"
      }`}
    >
      + Add Task
    </button>
    
    {/* Dropdown Form with improved DatePicker */}
    {showDropdown && (
      <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-lg z-10 ${
        isDarkTheme 
          ? "bg-gray-700 border border-gray-600" 
          : "bg-white border border-blue-100"
      }`}>
        <div className="p-4">
          <h3 className="text-sm font-bold mb-3">Add New Task</h3>
          <input
            type="text"
            placeholder="What's your priority?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`w-full px-3 py-2 mb-3 rounded-lg text-sm ${
              isDarkTheme 
                ? "bg-gray-600 border-gray-500" 
                : "bg-blue-50 border-blue-200"
            } border focus:ring-2 focus:ring-blue-400 focus:outline-none`}
          />
          
          {/* Improved DatePicker Styling */}
          <div className={`mb-3 ${isDarkTheme ? 'react-datepicker-dark' : ''}`}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date and time"
              className={`w-full px-3 py-2 rounded-lg text-sm ${
                isDarkTheme 
                  ? "bg-gray-600 border-gray-500 text-white" 
                  : "bg-blue-50 border-blue-200 text-gray-800"
              } border focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              calendarClassName={isDarkTheme ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-800 border-blue-200"}
              timeClassName={isDarkTheme ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"}
              popperClassName="z-20"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDropdown(false)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all hover:bg-gray-200 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className={`px-4 py-1.5 text-xs rounded-lg font-medium text-white shadow-md transition-all hover:scale-105 ${
                isDarkTheme 
                  ? "bg-gradient-to-r from-blue-500 to-sky-600" 
                  : "bg-gradient-to-r from-blue-400 to-sky-500"
              }`}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        {/* Task List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className={`text-center p-6 rounded-xl ${
              isDarkTheme 
                ? "bg-gray-700/50 text-gray-400" 
                : "bg-white/80 text-gray-500 shadow-inner"
            }`}>
              <p className="mb-2">Your mission list is empty</p>
              <p className="text-sm opacity-75">Add tasks to stay focused and productive!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] ${
                  isDarkTheme
                    ? "bg-gray-700/70 hover:bg-gray-700 border border-gray-600"
                    : "bg-white hover:bg-blue-50 border border-blue-100"
                } shadow-sm hover:shadow-md cursor-pointer`}
              >
                
                <div className="relative z-10 flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(todo.id || 0, todo.completed);
                    }}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? "bg-green-400 border-green-400"
                        : isDarkTheme
                        ? "border-gray-400 hover:border-blue-400"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}>
                      {todo.title}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDarkTheme ? "text-gray-400" : "text-gray-500"
                    }`}>
                      ⏰ {todo.dueTime && !isNaN(new Date(todo.dueTime).getTime())
                        ? format(new Date(todo.dueTime), "MMM d, h:mm a")
                        : "No deadline"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(todo.id || 0);
                    }}
                    className={`p-1 rounded-full transition-all ${
                      isDarkTheme 
                        ? "hover:bg-gray-600 text-gray-300 hover:text-red-400" 
                        : "hover:bg-blue-100 text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className={`mt-6 pt-4 border-t text-xs flex justify-between ${
          isDarkTheme ? "border-gray-700 text-gray-400" : "border-blue-100 text-gray-500"
        }`}>
          <span>📊 Total: {todos.length}</span>
          <span>✅ Completed: {todos.filter(t => t.completed).length}</span>
          <span>🔥 Remaining: {todos.filter(t => !t.completed).length}</span>
        </div>
      </div>
    </div>
  );
}