"use server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
})

export async function uploadPhoto(formData: any) {
  const image = await formData.get("file")
  const fileBuffer = await image.arrayBuffer()

  var mime = image.type
  var encoding = "base64"
  var base64Data = Buffer.from(fileBuffer).toString("base64")
  var fileUri = "data:" + mime + ";" + encoding + "," + base64Data

  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload(fileUri, {
            invalidate: true,
            folder: "basoin",
          })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }

    const result: any = await uploadToCloudinary()

    return {
      status: 200,
      message: "Berhasil mengupload gambar",
      data: {
        publicId: result.public_id,
        url: result.secure_url,
      },
    }
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    }
  }
}

export async function deletePhoto(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)

    return {
      status: 200,
      message: "Berhasil menghapus gambar",
    }
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    }
  }
}
