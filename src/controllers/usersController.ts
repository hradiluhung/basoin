import axios from "axios"

// SIGN UP
export const signUp = async (newUser: {
  name: string
  username: string
  angkatan: number
  password: string
}) => {
  try {
    const response = await axios.post("/api/auth/users", newUser)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// GET ALL USERS
export const getAllUsers = async () => {
  try {
    const response = await axios.get("/api/users")

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// GET USER BY ID
export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// UPDATE USER BY ID
export const updateUserById = async ({
  id,
  username,
  name,
  angkatan,
}: {
  id: string
  username: string
  name: string
  angkatan: number
}) => {
  try {
    const response = await axios.put(`/api/users/${id}`, {
      username,
      name,
      angkatan,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// UPDATE PASSWORD BY USER ID
export const updatePasswordById = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: string
  oldPassword: string
  newPassword: string
}) => {
  try {
    const response = await axios.put(`/api/users/${id}/password`, {
      oldPassword,
      newPassword,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
