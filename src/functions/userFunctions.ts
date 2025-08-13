import { Types } from "mongoose"
import { User } from "@/models/User"
import { saveImageLocally } from "@/lib/saveImageLocally"
import bcrypt from "bcrypt"
import { connectToDatabase } from "@/lib/db" // Make sure this exists

// 🧼 Clean + format user input
const sanitizeUserData = async (data: {
  name: string
  email: string
  password?: string | null
  roleId: string
  imageFile?: File | null
  existingPassword?: string
}) => {
  let imagePath = ""

  if (data.imageFile) {
    imagePath = await saveImageLocally(data.imageFile)
  }

  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password
      ? await bcrypt.hash(data.password, 10)
      : data.existingPassword, // Keep old password if no new password
    role: new Types.ObjectId(data.roleId),
    image: imagePath,
  }
}

// 📤 Format user object for frontend/client
const serializeUser = (user: any) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role?.toString?.(),
  image: user.image || "",
  isActive: user.isActive,
  createdAt: user.createdAt?.toISOString?.(),
  updatedAt: user.updatedAt?.toISOString?.(),
})

/**
 * CREATE User
 */
export const createUser = async (formData: FormData) => {
  await connectToDatabase()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const roleId = formData.get("roleId") as string
  const imageFile = formData.get("image") as File | null

  const userData = await sanitizeUserData({
    name,
    email,
    password,
    roleId,
    imageFile,
  })

  const user = await new User(userData).save()
  return serializeUser(user)
}

/**
 * GET all users
 */
export const getAllUsers = async () => {
  await connectToDatabase()
  const users = await User.find().sort({ createdAt: -1 }).lean()
  return users.map(serializeUser)
}

/**
 * GET user by ID
 */
export const getUserById = async (id: string) => {
  await connectToDatabase()
  const user = await User.findById(id).lean()
  return user ? serializeUser(user) : null
}

/**
 * UPDATE user by ID
 */
export const updateUser = async (
  id: string,
  formData: FormData
): Promise<ReturnType<typeof serializeUser> | null> => {
  await connectToDatabase()

  const existingUser = await User.findById(id)
  if (!existingUser) return null

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = (formData.get("password") as string) || null
  const roleId = formData.get("roleId") as string
  const imageFile = formData.get("image") as File | null

  const updatedData = await sanitizeUserData({
    name,
    email,
    password,
    roleId,
    imageFile,
    existingPassword: existingUser.password, // Keep old password if password not provided
  })

  const user = await User.findByIdAndUpdate(id, { $set: updatedData }, { new: true }).lean()
  return user ? serializeUser(user) : null
}

/**
 * DELETE user by ID
 */
export const deleteUser = async (
  id: string
): Promise<ReturnType<typeof serializeUser> | null> => {
  await connectToDatabase()
  const user = await User.findByIdAndDelete(id).lean()
  return user ? serializeUser(user) : null
}
