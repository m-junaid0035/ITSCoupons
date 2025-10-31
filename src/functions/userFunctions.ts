import { Types } from "mongoose"
import { User } from "@/models/User"
import { saveUserProfileImage } from "@/lib/saveImageLocally"
import { deleteUploadedFile } from "@/lib/deleteFile"
import bcrypt from "bcrypt"
import { connectToDatabase } from "@/lib/db"

// 🧼 Clean + format user input, handles isActive
const sanitizeUserData = async (data: {
  name: string
  email: string
  existingImage?: string;
  password?: string | null
  roleId: string
  imageFile?: File | null
  existingPassword?: string
  isActive?: boolean
}) => {
  let imagePath = ""

  if (data.imageFile) {
    imagePath = await saveUserProfileImage(data.imageFile)
  }
  else if (data.existingImage) {
    imagePath = data.existingImage
  }

  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password
      ? await bcrypt.hash(data.password, 10)
      : data.existingPassword, // keep old password if no new one
    role: new Types.ObjectId(data.roleId),
    image: imagePath,
    isActive: data.isActive ?? true, // default true
  }
}

// 📤 Format user object for frontend/client
const serializeUser = (user: any) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role?.toString?.(),
  image: user.image || "",
  isActive: user.isActive ?? true,
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
  const isActive = formData.get("isActive") === "true" // checkbox from frontend

  const userData = await sanitizeUserData({
    name,
    email,
    password,
    roleId,
    imageFile,
    isActive,
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
  const existingImage = formData.get("existingImage") as string
  const email = formData.get("email") as string
  const password = (formData.get("password") as string) || null
  const roleId = formData.get("roleId") as string
  const imageFile = formData.get("image") as File | null
  const isActive = formData.get("isActive") === "true" // handle checkbox

  const updatedData = await sanitizeUserData({
    name,
    email,
    password,
    roleId,
    imageFile,
    existingImage,
    existingPassword: existingUser.password,
    isActive,
  })

  // 🧹 Delete old image if new image uploaded
  if (imageFile && existingUser.image) {
    await deleteUploadedFile(existingUser.image)
  }

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

  if (user && user.image) {
    await deleteUploadedFile(user.image)
  }

  return user ? serializeUser(user) : null
}
