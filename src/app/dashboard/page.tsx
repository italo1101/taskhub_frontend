"use client";

import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ProfileModal from "@/components/dashboard/ProfileModal";
import SearchFilters from "@/components/dashboard/SearchFilters";
import Sidebar, { type DashboardView } from "@/components/dashboard/Sidebar";
import StatsBar from "@/components/dashboard/StatsBar";
import TaskList from "@/components/dashboard/TaskList";
import TaskModal from "@/components/dashboard/TaskModal";
import TeamView from "@/components/dashboard/TeamView";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import { UnauthorizedError } from "@/lib/api";
import { getToken } from "@/lib/token";
import * as taskService from "@/services/task.service";
import type { Task, TaskStatus } from "@/types/task.types";
import type { DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  Bell,
  LayoutGrid,
  List,
  Menu,
  Plus,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("tarefas");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("PENDING");

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.replace("/");
        return;
      }
      setTasksError(
        err instanceof Error ? err.message : "Erro ao carregar tarefas.",
      );
    } finally {
      setTasksLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
      return;
    }
    loadTasks();
  }, [router, loadTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description?.toLowerCase().includes(search.toLowerCase()) ??
          false);
      const matchStatus =
        statusFilter === "todos" || task.status === statusFilter;
      const matchPriority =
        priorityFilter === "todas" || task.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const openCreateModal = (status: TaskStatus = "PENDING") => {
    setEditingTask(null);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSaved = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [task, ...prev];
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta tarefa?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.replace("/");
        return;
      }
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  };

  const handleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus: TaskStatus =
      task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const updated = await taskService.updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.replace("/");
        return;
      }
      alert(err instanceof Error ? err.message : "Erro ao atualizar.");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t,
      ),
    );

    try {
      const updated = await taskService.updateTask(draggableId, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === draggableId ? updated : t)),
      );
    } catch (err) {
      setTasks(previousTasks);
      if (err instanceof UnauthorizedError) {
        router.replace("/");
        return;
      }
      alert(err instanceof Error ? err.message : "Erro ao mover tarefa.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg leading-none font-bold text-foreground">
                Dashboard
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activeView === "tarefas"
                  ? "Gerencie suas tarefas"
                  : "Sua equipe"}
              </p>
            </div>
            </div>
          <div className="flex items-center gap-3">
            {activeView === "tarefas" && (
              <div className="flex items-center gap-0.5 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                    viewMode === "kanban"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
              </div>
            )}
            <div className="hidden sm:block">
              <DarkModeToggle />
            </div>
            <button
              type="button"
              className="relative rounded-lg p-2 transition-colors hover:bg-muted"
              aria-label="NotificaÃ§Ãµes"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 transition-colors hover:bg-primary/25"
              aria-label="Perfil"
            >
              <User className="h-4 w-4 text-primary" />
            </button>
          </div>
        </header>

        <main className="space-y-6 p-5 lg:p-8">
          {activeView === "equipe" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TeamView />
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <StatsBar tasks={tasks} />
              </motion.div>

              {tasksError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                  {tasksError}
                </p>
              )}

              {tasksLoading ? (
                <p className="text-sm text-muted-foreground">
                  Carregando tarefasâ€¦
                </p>
              ) : viewMode === "kanban" ? (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
                  >
                    <SearchFilters
                      search={search}
                      onSearchChange={setSearch}
                      statusFilter={statusFilter}
                      onStatusChange={setStatusFilter}
                      priorityFilter={priorityFilter}
                      onPriorityChange={setPriorityFilter}
                    />
                    <button
                      type="button"
                      onClick={() => openCreateModal()}
                      className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      Nova Tarefa
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <KanbanBoard
                      tasks={filteredTasks}
                      onDragEnd={handleDragEnd}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onAddTask={openCreateModal}
                    />
                  </motion.div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-4 lg:col-span-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <SearchFilters
                        search={search}
                        onSearchChange={setSearch}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        priorityFilter={priorityFilter}
                        onPriorityChange={setPriorityFilter}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <TaskList
                        tasks={filteredTasks}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <button
                        type="button"
                        onClick={() => openCreateModal()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
                      >
                        <Plus className="h-4 w-4" />
                        Nova Tarefa
                      </button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                    >
                      <WeatherWidget />
                    </motion.div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <TaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSaved={handleTaskSaved}
        defaultStatus={defaultStatus}
      />
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
