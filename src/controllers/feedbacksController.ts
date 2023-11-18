import axios from "axios"

// GET ALL FEEDBACKS
export const getAllFeedbacks = async () => {
  try {
    const response = await axios.get("/api/feedbacks")

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// CREATE NEW FEEDBACK
export const createFeedback = async ({
  userId,
  title,
  description,
  image,
  publicId,
}: {
  userId: string
  title: string
  description: string
  image: string
  publicId: string
}) => {
  try {
    const response = await axios.post(`/api/feedbacks/${userId}`, {
      title,
      description,
      image,
      publicId,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
