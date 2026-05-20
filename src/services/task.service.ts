import { apiFetch } from "@/lib/api";
import type { CreateTaskDto, Task, UpdateTaskDto } from "@/types/task.types";

export async function getTasks(): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks");
}

export async function createTask(dto: CreateTaskDto): Promise<Task> {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/tasks/${id}`, { method: "DELETE" });
}
