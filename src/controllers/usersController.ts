import axios from "axios"

// GET ALL USERS
export const getAllUsers = async () => {
  try {
    const response = await axios.get("/api/users")

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// SIGN UP
export const signUp = async (newUser: {
  name: string
  username: string
  angkatan: number
  password: string
}) => {
  try {
    const response = await axios.post("/api/users/signup", newUser)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
