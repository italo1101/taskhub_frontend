import type { TaskPriority, TaskStatus } from "@/types/task.types";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em Progresso",
  COMPLETED: "Concluída",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

export function statusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    case "IN_PROGRESS":
      return "bg-primary/15 text-primary";
    case "COMPLETED":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  }
}

export function statusDotClass(status: TaskStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-500";
    case "IN_PROGRESS":
      return "bg-primary";
    case "COMPLETED":
      return "bg-emerald-500";
  }
}

export function priorityTextClass(priority: TaskPriority): string {
  switch (priority) {
    case "ALTA":
      return "text-red-500";
    case "MEDIA":
      return "text-amber-500";
    case "BAIXA":
      return "text-blue-500";
  }
}

export function priorityFlagClass(priority: TaskPriority): string {
  switch (priority) {
    case "ALTA":
      return "text-red-500 fill-red-500/20";
    case "MEDIA":
      return "text-amber-500 fill-amber-500/20";
    case "BAIXA":
      return "text-blue-500 fill-blue-500/20";
  }
}
