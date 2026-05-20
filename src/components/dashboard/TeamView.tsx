"use client";

import * as userService from "@/services/user.service";
import type { User } from "@/types/user.types";
import { useEffect, useState } from "react";

export default function TeamView() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar equipe."),
      )
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando equipe…</p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-5 py-3 font-medium text-muted-foreground">Nome</th>
            <th className="px-5 py-3 font-medium text-muted-foreground">E-mail</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border/60 last:border-0 hover:bg-muted/20"
            >
              <td className="px-5 py-3.5 font-medium text-foreground">
                {user.name ?? "—"}
              </td>
              <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
