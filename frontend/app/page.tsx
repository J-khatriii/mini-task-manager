"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/types/task";
import * as api from "@/lib/api";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const loadTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      setError("");
      const fetchedTasks = await api.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks. Is the backend running?"
      );
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (title: string) => {
    try {
      setIsAdding(true);
      setError("");
      const newTask = await api.createTask(title);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      setLoadingTaskId(id);
      setError("");
      const updatedTask = await api.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setLoadingTaskId(id);
      setError("");
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Task Manager
          </h1>
          <p className="text-gray-500">Stay organized, get things done.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <TaskInput onAdd={handleAddTask} isLoading={isAdding} />

          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                {error.includes("backend") && (
                  <p className="text-xs text-red-500 mt-1">Make sure the backend server is running on port 5000.</p>
                )}
              </div>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition-colors" aria-label="Dismiss error">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {isLoadingTasks ? (
            <div className="space-y-3" aria-label="Loading tasks" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              loadingTaskId={loadingTaskId}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Mini Task Manager · Built with Next.js, Express & MongoDB
        </p>
      </div>
    </main>
  );
}
