"use client";

import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import { logout } from "@/services/auth.service";
import { ClipboardList, LogOut, Users, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import taskhubLogo from "../../../public/image.png";

export type DashboardView = "tarefas" | "equipe";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const navItemClass = (view: DashboardView) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      activeView === view
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Image
              src={taskhubLogo}
              alt="TaskHub Dulino"
              className="h-8 w-auto object-contain"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <button
            type="button"
            className={navItemClass("tarefas")}
            onClick={() => {
              onViewChange("tarefas");
              onClose();
            }}
          >
            <ClipboardList className="h-4 w-4" />
            Tarefas
          </button>
          <button
            type="button"
            className={navItemClass("equipe")}
            onClick={() => {
              onViewChange("equipe");
              onClose();
            }}
          >
            <Users className="h-4 w-4" />
            Equipe
          </button>
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Tema
            </span>
            <DarkModeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
