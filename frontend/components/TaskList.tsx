"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";

type FilterType = "all" | "active" | "completed";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loadingTaskId: string | null;
}

const TaskList = ({ tasks, onToggle, onDelete, loadingTaskId }: TaskListProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: tasks.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4" role="img" aria-label="clipboard">
          📋
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-400 text-sm">
          Add your first task above to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${
                          filter === key
                            ? "bg-white text-gray-800 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
            aria-pressed={filter === key}
          >
            {label}
            <span
              className={`ml-1.5 inline-flex items-center justify-center
                          w-5 h-5 rounded-full text-xs
                          ${
                            filter === key
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No {filter} tasks</p>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Task list">
          {filteredTasks.map((task) => (
            <div key={task._id} role="listitem">
              <TaskItem
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                isLoading={loadingTaskId === task._id}
              />
            </div>
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-6">
          {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
          {completedCount > 0 && ` · ${completedCount} completed`}
        </p>
      )}
    </div>
  );
};

export default TaskList;
