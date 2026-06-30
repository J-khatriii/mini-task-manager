"use client";

import { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TaskItem = ({ task, onToggle, onDelete, isLoading }: TaskItemProps) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl border
                  transition-all duration-200 shadow-sm
                  ${
                    task.completed
                      ? "bg-gray-50 border-gray-100"
                      : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-md"
                  }`}
    >
      <button
        onClick={() => onToggle(task._id)}
        disabled={isLoading}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        aria-pressed={task.completed}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    transition-all duration-200 cursor-pointer
                    disabled:cursor-not-allowed
                    ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
      >
        {task.completed && (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-medium truncate transition-all duration-200
                      ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
        >
          {task.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Added {formattedDate}
          {task.completed && (
            <span className="ml-2 text-green-500 font-medium">✓ Completed</span>
          )}
        </p>
      </div>

      <button
        onClick={() => onDelete(task._id)}
        disabled={isLoading}
        aria-label={`Delete task: ${task.title}`}
        className="flex-shrink-0 p-2 rounded-lg
                   text-gray-300 hover:text-red-500 hover:bg-red-50
                   opacity-0 group-hover:opacity-100 sm:opacity-100
                   transition-all duration-200
                   disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;
