'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  // Queries
  const { data: todos, isLoading, error } = trpc.todos.list.useQuery();
  
  // Mutations
  const createTodo = trpc.todos.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch todos after creating a new one
      utils.todos.list.invalidate();
      setNewTodoTitle('');
    },
  });
  
  const updateTodo = trpc.todos.update.useMutation({
    onSuccess: () => {
      utils.todos.list.invalidate();
    },
  });
  
  const deleteTodo = trpc.todos.delete.useMutation({
    onSuccess: () => {
      utils.todos.list.invalidate();
    },
  });

  // Get utils for cache invalidation
  const utils = trpc.useUtils();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    createTodo.mutate({
      title: newTodoTitle,
      completed: false,
    });
  };

  // Handle todo toggle
  const handleToggle = (id: string, completed: boolean, title: string) => {
    updateTodo.mutate({
      id,
      title,
      completed: !completed,
    });
  };

  // Handle todo deletion
  const handleDelete = (id: string) => {
    deleteTodo.mutate(id);
  };

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={createTodo.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createTodo.isPending ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed, todo.title)}
                className="h-4 w-4"
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              disabled={deleteTodo.isPending}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Error Messages */}
      {createTodo.error && (
        <div className="mt-2 text-red-500">
          Error creating todo: {createTodo.error.message}
        </div>
      )}
      {updateTodo.error && (
        <div className="mt-2 text-red-500">
          Error updating todo: {updateTodo.error.message}
        </div>
      )}
      {deleteTodo.error && (
        <div className="mt-2 text-red-500">
          Error deleting todo: {deleteTodo.error.message}
        </div>
      )}
    </div>
  );
} 