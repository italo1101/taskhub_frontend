"use client";

import type { Task } from "@/types/task.types";
import { CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: ListTodo,
      iconClass: "text-foreground",
      bgClass: "bg-muted",
    },
    {
      label: "Pendentes",
      value: pending,
      icon: Clock,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
    },
    {
      label: "Em Progresso",
      value: inProgress,
      icon: Circle,
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      label: "Concluídas",
      value: completed,
      icon: CheckCircle2,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgClass}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
