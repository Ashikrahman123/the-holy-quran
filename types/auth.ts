export enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string
  name?: string | null
  email: string
  username?: string
  role?: Role
  image?: string | null
}

export interface SignupData {
  name?: string
  email: string
  username?: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  username?: string
  image?: string
}
