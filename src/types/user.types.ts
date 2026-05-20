export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface UpdateProfileDto {
  name: string;
  oldPassword?: string;
  newPassword?: string;
}
