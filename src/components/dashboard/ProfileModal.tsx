"use client";

import { saveUser, getUser } from "@/lib/session";
import * as userService from "@/services/user.service";
import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60";

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordsFilled = newPassword.length > 0 || confirmPassword.length > 0;
  const passwordsMatch =
    !passwordsFilled || (newPassword === confirmPassword && newPassword.length > 0);
  const canSavePassword =
    passwordsFilled &&
    passwordsMatch &&
    oldPassword.length > 0 &&
    newPassword.length > 0;

  useEffect(() => {
    if (!open) return;
    const user = getUser();
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordsFilled && !canSavePassword) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dto: {
        name: string;
        oldPassword?: string;
        newPassword?: string;
      } = { name: name.trim() };

      if (passwordsFilled) {
        dto.oldPassword = oldPassword;
        dto.newPassword = newPassword;
      }

      const updated = await userService.updateProfile(dto);
      saveUser(updated);
      setSuccess(
        passwordsFilled
          ? "Perfil e senha atualizados com sucesso."
          : "Perfil atualizado com sucesso.",
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Meu perfil</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              E-mail
            </label>
            <input
              type="email"
              disabled
              value={email}
              className={`${inputClass} cursor-not-allowed bg-muted text-muted-foreground`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Nome
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Alterar senha
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Senha atual
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Nova senha
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                {passwordsFilled && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    As senhas não coincidem.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                (passwordsFilled && !canSavePassword) ||
                !name.trim()
              }
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
