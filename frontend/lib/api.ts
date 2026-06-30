import { Task, ApiResponse } from "@/types/task";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetchJson = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data: T = await response.json();

  if (!response.ok) {
    const errorData = data as unknown as ApiResponse<never>;
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetchJson<ApiResponse<Task[]>>(`${API_BASE_URL}/tasks`);
  return response.data ?? [];
};

export const createTask = async (title: string): Promise<Task> => {
  const response = await fetchJson<ApiResponse<Task>>(`${API_BASE_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  if (!response.data) {
    throw new Error("No task data returned from server");
  }

  return response.data;
};

export const toggleTask = async (id: string): Promise<Task> => {
  const response = await fetchJson<ApiResponse<Task>>(
    `${API_BASE_URL}/tasks/${id}`,
    { method: "PATCH" }
  );

  if (!response.data) {
    throw new Error("No task data returned from server");
  }

  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await fetchJson<ApiResponse<{ id: string }>>(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
};
