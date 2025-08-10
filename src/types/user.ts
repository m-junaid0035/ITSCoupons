// types/user.ts

export interface UserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
  imageFile?: File | null;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role?: string; // role ID as string
  image: string;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type UserListResponse = UserData[];

export type UserSingleResponse = UserData | null;
