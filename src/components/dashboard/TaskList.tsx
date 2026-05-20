"use client";

import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  priorityTextClass,
  statusBadgeClass,
} from "@/lib/task-labels";
import type { Task } from "@/types/task.types";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Flag,
  Pencil,
  Trash2,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "";
  }
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onComplete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma tarefa encontrada.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isCompleted = task.status === "COMPLETED";
        return (
          <div
            key={task.id}
            className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary"
                aria-label={isCompleted ? "Reabrir tarefa" : "Concluir tarefa"}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-semibold text-foreground ${isCompleted ? "line-through opacity-60" : ""}`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex flex-shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {task.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(task.status)}`}
                  >
                    {STATUS_LABELS[task.status]}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-medium ${priorityTextClass(task.priority)}`}
                  >
                    <Flag className="h-3 w-3" />
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
