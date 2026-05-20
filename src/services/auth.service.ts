import type {
  ApiErrorBody,
  AuthResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse,
} from "@/types/auth.types";

const TOKEN_KEY = "taskhub_token";

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não está definida. Configure em .env.local",
    );
  }
  return url.replace(/\/$/, "");
}

function normalizeErrorMessage(body: ApiErrorBody): string {
  const { message } = body;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.length > 0) return message;
  return "Ocorreu um erro. Tente novamente.";
}

async function parseErrorResponse(response: Response): Promise<never> {
  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    /* resposta não-JSON */
  }
  throw new Error(normalizeErrorMessage(body));
}

export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  const data = (await response.json()) as AuthResponse;
  saveToken(data.token);
  return data;
}

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  const response = await fetch(`${getApiUrl()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  return (await response.json()) as RegisterResponse;
}

export async function registerAndLogin(
  dto: RegisterDto,
): Promise<AuthResponse> {
  await register(dto);
  return login({ email: dto.email, password: dto.password });
}
