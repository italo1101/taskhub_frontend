import { apiFetch } from "@/lib/api";
import type { UpdateProfileDto, User } from "@/types/user.types";

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users");
}

export async function updateProfile(dto: UpdateProfileDto): Promise<User> {
  return apiFetch<User>("/users/profile", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}
