"use server"

import path from "path"
import fs from "fs/promises"
import { v4 as uuidv4 } from "uuid"
import os from "os"

import { v2 as cloudinary } from "cloudinary"
import { revalidatePath } from "next/cache"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
})

async function savePhotoToLocal(formData: any) {
  const file = formData.get("file")

  const bufferPromise = file.arrayBuffer().then((data: any) => {
    const buffer = Buffer.from(data)
    const name = uuidv4()
    const ext = file.type.split("/")[1]

    // const uploadDir = path.join(process.cwd(), "public", `/${name}.${ext}`);

    const tempdir = os.tmpdir()
    const uploadDir = path.join(tempdir, `/${name}.${ext}`)

    fs.writeFile(uploadDir, buffer)

    return {
      filePath: uploadDir,
      fileName: file.name,
    }
  })

  return await Promise.resolve(bufferPromise)
}

async function uploadPhotoToCloudinary(newFile: any) {
  const photoPromise = cloudinary.uploader.upload(newFile.filePath, {
    folder: "basoin",
  })

  console.log("PHOTO PROMISE:" + photoPromise)

  return await Promise.resolve(photoPromise)
}

export async function uploadPhoto(formData: any) {
  try {
    const newFile = await savePhotoToLocal(formData)
    console.log("NEW FILE:" + newFile)

    const photos = await uploadPhotoToCloudinary(newFile)
    console.log("PHOTOS:" + photos)

    fs.unlink(newFile.filePath)
    revalidatePath("/")

    return {
      status: 200,
      message: "Berhasil mengupload gambar",
      data: {
        publicId: photos.public_id,
        url: photos.secure_url,
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
