"use client";

import { useState, FormEvent } from "react";

interface TaskInputProps {
  onAdd: (title: string) => Promise<void>;
  isLoading: boolean;
}

const TaskInput = ({ onAdd, isLoading }: TaskInputProps) => {
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Task title must be 200 characters or less");
      return;
    }

    setError("");

    try {
      await onAdd(trimmedTitle);
      setTitle("");
    } catch {
      setError("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 
                     bg-white text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-sm"
          maxLength={200}
          aria-label="New task title"
          aria-describedby={error ? "input-error" : undefined}
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold rounded-xl 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add task"
        >
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && (
        <p
          id="input-error"
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TaskInput;
