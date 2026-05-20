import { publicFetch } from "@/lib/api";
import { clearUser, saveUser } from "@/lib/session";
import { clearToken, getToken, saveToken } from "@/lib/token";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse,
} from "@/types/auth.types";

export { clearToken, getToken, saveToken };

export function logout(): void {
  clearToken();
  clearUser();
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const data = await publicFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  saveToken(data.token);
  saveUser(data.user);
  return data;
}

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  return publicFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function registerAndLogin(
  dto: RegisterDto,
): Promise<AuthResponse> {
  await register(dto);
  return login({ email: dto.email, password: dto.password });
}
