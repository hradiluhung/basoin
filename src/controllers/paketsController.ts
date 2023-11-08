import axios from "axios"

// GET ALL PAKET BY SUBJECTID
export const getAllPaketsBySubjectId = async (subjectId: string) => {
  try {
    const response = await axios.get(`/api/pakets/subject/${subjectId}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// CREATE PAKET BY SUBJECTID
export const createPaketBySubjectId = async (
  subjectId: string,
  year: number,
  type: string
) => {
  try {
    const response = await axios.post(`/api/pakets/subject/${subjectId}`, {
      year,
      type,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// DELETE PAKET BY ID
export const deletePaketByPaketId = async (id: string) => {
  try {
    const response = await axios.delete(`/api/pakets/${id}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// GET PAKET BY ID
export const getPaketByPaketId = async (id: string) => {
  try {
    const response = await axios.get(`/api/pakets/${id}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
