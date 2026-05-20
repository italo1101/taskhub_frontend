"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  priorityTextClass,
  statusDotClass,
} from "@/lib/task-labels";
import type { Task, TaskStatus } from "@/types/task.types";
import { Flag, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "PENDING", label: "Pendente" },
  { id: "IN_PROGRESS", label: "Em Progresso" },
  { id: "COMPLETED", label: "Concluída" },
];

interface KanbanBoardProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export default function KanbanBoard({
  tasks,
  onDragEnd,
  onEdit,
  onDelete,
  onAddTask,
}: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div
              key={column.id}
              className="flex flex-col rounded-xl border border-border/60 bg-muted/20"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${statusDotClass(column.id)}`}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {column.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({columnTasks.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddTask(column.id)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Adicionar tarefa"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[200px] flex-1 flex-col gap-3 p-3 transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`rounded-xl border border-border/60 bg-card p-3 shadow-sm ${
                              dragSnapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
                            }`}
                          >
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab text-muted-foreground active:cursor-grabbing"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className="flex gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => onEdit(task)}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete(task.id)}
                                  className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                              <span
                                className={`flex items-center gap-1 text-[10px] font-medium ${priorityTextClass(task.priority)}`}
                              >
                                <Flag className="h-3 w-3" />
                                {PRIORITY_LABELS[task.priority]}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {STATUS_LABELS[task.status]}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
