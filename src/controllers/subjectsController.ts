import axios from "axios";

// GET ALL SUBJECTS
export const getAllSubjects = async () => {
  try {
    const response = await axios.get("/api/subjects");

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// GET SUBJECT BY ID
export const getSubjectById = async (id: string) => {
  try {
    const response = await axios.get(`/api/subjects/${id}`);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// CREATE NEW SUBJECT
export const createSubject = async ({
  code,
  name,
  semester,
  image,
  publicId,
}: {
  code: string;
  name: string;
  semester: string;
  image: string;
  publicId: string;
}) => {
  try {
    const response = await axios.post("/api/subjects", {
      code,
      name,
      semester,
      image,
      publicId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// UPDATE SUBJECT BY ID
export const updateSubject = async ({
  id,
  code,
  name,
  semester,
  image,
  publicId,
}: {
  id: string;
  code: string;
  name: string;
  semester: string;
  image: string;
  publicId: string;
}) => {
  try {
    const response = await axios.put(`/api/subjects/${id}`, {
      code,
      name,
      semester,
      image,
      publicId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// DELETE SUBJECT BY ID
export const deleteSubject = async (id: string) => {
  try {
    const response = await axios.delete(`/api/subjects/${id}`);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
