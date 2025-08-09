// actions/userActions.ts
"use server"

import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "@/functions/userFunctions"
import { connectToDatabase } from "@/lib/db"

export type UserFormState = {
  error?: Record<string, string[]> | { message?: string[] }
  data?: any
}

/**
 * CREATE User
 */
export async function createUserAction(
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await connectToDatabase()

  try {
    const user = await createUser(formData)
    return { data: user }
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create user"] } }
  }
}

/**
 * UPDATE User
 */
export async function updateUserAction(
  prevState: UserFormState,
  id: string,
  formData: FormData
): Promise<UserFormState> {
  await connectToDatabase()

  try {
    const user = await updateUser(id, formData)
    return { data: user }
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update user"] } }
  }
}

/**
 * DELETE User
 */
export async function deleteUserAction(id: string): Promise<UserFormState> {
  await connectToDatabase()

  try {
    const deletedUser = await deleteUser(id)
    return { data: deletedUser }
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete user"] } }
  }
}

/**
 * FETCH All Users
 */
export async function fetchAllUsersAction(): Promise<UserFormState> {
  await connectToDatabase()

  try {
    const users = await getAllUsers()
    return { data: users }
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch users"] } }
  }
}

/**
 * FETCH Single User
 */
export async function fetchUserByIdAction(id: string): Promise<UserFormState> {
  await connectToDatabase()

  try {
    const user = await getUserById(id)
    if (!user) return { error: { message: ["User not found"] } }
    return { data: user }
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch user"] } }
  }
}
