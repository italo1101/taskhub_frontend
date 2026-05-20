"use client";

import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import * as authService from "@/services/auth.service";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import taskhubLogo from "../../../public/image.png";

type AuthTab = "login" | "register";

const STATS = [
  { value: "10k+", label: "Usuários" },
  { value: "50k+", label: "Tarefas criadas" },
  { value: "99.9%", label: "Uptime" },
] as const;

const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export function AuthForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.registerAndLogin({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar conta.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <motion.div className="relative hidden flex-1 overflow-hidden bg-primary lg:flex">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-center px-16 text-white"
        >
          <div className="mb-10 flex items-center gap-3">
            <Image
              src={taskhubLogo}
              alt="TaskHub Dulino"
              className="h-12 w-auto object-contain"
              priority
            />
            <div>
              <h1 className="text-2xl leading-none font-bold">TaskHub</h1>
              <span className="text-sm font-medium text-white/70">Dulino</span>
            </div>
          </div>
          <h2 className="max-w-md text-4xl leading-tight font-extrabold">
            Gerencie suas tarefas com
            <span className="block text-white/80">eficiência e estilo</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/50">
            Uma plataforma moderna para organizar projetos, colaborar com
            equipes e entregar resultados excepcionais.
          </p>
          <div className="mt-12 flex gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-0.5 text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Image
              src={taskhubLogo}
              alt="TaskHub Dulino"
              className="h-7 w-auto object-contain"
            />
            <span className="text-sm font-bold text-foreground">
              TaskHub{" "}
              <span className="font-medium text-primary">Dulino</span>
            </span>
          </div>
          <div className="lg:ml-auto">
            <DarkModeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Bem-vindo de volta
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Entre ou crie sua conta para continuar
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <div
              className="mb-6 grid h-10 w-full grid-cols-2 rounded-lg bg-muted p-1"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "login"}
                onClick={() => switchTab("login")}
                className={`rounded-md text-sm font-medium transition-all ${
                  activeTab === "login"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "register"}
                onClick={() => switchTab("register")}
                className={`rounded-md text-sm font-medium transition-all ${
                  activeTab === "register"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cadastrar
              </button>
            </div>

            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="login-email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="login-password"
                      type="password"
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Entrando…" : "Entrar"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="register-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      disabled={isLoading}
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="register-email"
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="register-password"
                      type="password"
                      required
                      minLength={8}
                      disabled={isLoading}
                      placeholder="Min. 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Criando conta…" : "Criar conta"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
