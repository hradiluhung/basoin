"use client"

import DropdownInput from "@/components/dropdownInput/DropdownInput"
import InputField from "@/components/inputField/InputField"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import { createSubject } from "@/controllers/subjectsController"
import { showToast } from "@/helpers/showToast"
import { uploadPhoto } from "@/helpers/uploadPhotos"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { ArrowLeftCircle, Loader, PlusCircle } from "react-feather"
import { useRouter } from "next/navigation"
import { WidgetTypes } from "@/constants/widgetTypes"
import { Semester } from "@/constants/subject"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"

export default function Page() {
  const { theme } = useTheme()
  const router = useRouter()

  const [image, setImage] = useState(null)
  const [subjectCode, setSubjectCode] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [semester, setSemester] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  async function onChangeInputFile(e: any) {
    const file = e.target.files[0]
    setImage(file)
  }

  const onSaveSubject = async (e: any) => {
    e.preventDefault()

    if (subjectCode === "" || subjectName === "" || semester === "") {
      showToast(
        "Pastikan kode, nama, dan semester terisi!",
        WidgetTypes.WARNING,
        theme
      )
      return
    }

    try {
      setIsLoading(true)

      const formData = new FormData()
      let resUploadPhoto = null

      if (image !== null) {
        formData.append("file", image)
        resUploadPhoto = await uploadPhoto(formData)
      }

      const res = await createSubject({
        code: subjectCode,
        name: subjectName,
        semester,
        image: resUploadPhoto?.data?.url || "",
        publicId: resUploadPhoto?.data?.publicId || "",
      })

      if (res.status === 201) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        onBackToPreviousScreen()
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
        setIsLoading(false)
      }
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">Tambah Mata Kuliah</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-4">
        <div className="mb-6 gap-4">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <ArrowLeftCircle
              className="w-6 h-6 cursor-pointer"
              onClick={onBackToPreviousScreen}
            />
            <h1>Tambah Mata Kuliah</h1>
          </div>
        </div>
        <div className="flex">
          <form
            onSubmit={onSaveSubject}
            className="basis-1/3 flex flex-col p-4 bg-card-color rounded-xl shadow-md lg:basis-1/2 md:basis-full sm:basis-full"
            method="post"
            encType="multipart/form-data"
          >
            <div className="mb-4">
              {image == null ? (
                <InputField
                  label="Gambar Cover"
                  placeholder="Pilih Gambar"
                  name="image"
                  id="image"
                  type="file"
                  required={false}
                  onChange={onChangeInputFile}
                />
              ) : (
                <>
                  <span className="block mb-2">Gambar Cover</span>
                  <div className="w-full px-2 py-2 rounded-md bg-input-color border border-soft-border-color focus:outline-blue-500">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Cover Mata Kuliah"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      className="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded-md"
                      onClick={() => {
                        setImage(null)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="mb-4">
              <InputField
                label="Kode Mata Kuliah"
                placeholder="IF1234"
                name="code"
                id="code"
                type="text"
                required={true}
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputField
                label="Nama Mata Kuliah"
                placeholder="Algoritma dan Pemrograman"
                name="subject"
                id="subject"
                type="text"
                required={true}
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <DropdownInput
                listItem={Object.values(Semester)}
                label="Semester"
                placeholder="Pilih Semester"
                name="semester"
                id="semester"
                required={true}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <PrimaryActionButton
                text="Tambah"
                isSubmit={true}
                ButtonIcon={isLoading ? Loader : PlusCircle}
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
