"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import InputField from "@/components/inputField/InputField"
import TextArea from "@/components/textArea/TextArea"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { WidgetTypes } from "@/constants/widgetTypes"
import { createFeedback } from "@/controllers/feedbacksController"
import { showToast } from "@/helpers/showToast"
import { uploadPhoto } from "@/helpers/uploadPhotos"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Check, Loader } from "react-feather"

type Props = {}

export default function page({}: Props) {
  const { data } = useSession()
  const { theme } = useTheme()

  const [inputFeedback, setInputFeedback] = useState({
    title: "",
    description: "",
    image: "",
    publicId: "",
  })
  const [image, setImage] = useState(null)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  async function onChangeInputFile(e: any) {
    const file = e.target.files[0]
    setImage(file)
  }

  const onSubmitFeedback = async () => {
    if (inputFeedback.title === "" || inputFeedback.description === "") {
      showToast("Judul dan Deskripsi harus diisi", WidgetTypes.ALERT, theme)
      return
    }

    if (data?.user?.id !== undefined) {
      try {
        setIsLoadingSubmit(true)
        const formData = new FormData()
        let resUploadPhoto = null

        if (image !== null) {
          formData.append("file", image)
          resUploadPhoto = await uploadPhoto(formData)

          setInputFeedback({
            ...inputFeedback,
            image: resUploadPhoto?.data?.url || "",
            publicId: resUploadPhoto?.data?.publicId || "",
          })
        }

        const res = await createFeedback({
          userId: data?.user?.id,
          description: inputFeedback.description,
          title: inputFeedback.title,
          image: resUploadPhoto?.data?.url || "",
          publicId: resUploadPhoto?.data?.publicId || "",
        })

        if (res.status === 201) {
          showToast(res.message, WidgetTypes.SUCCESS, theme)
        } else {
          showToast(res.message, WidgetTypes.ALERT, theme)
        }
      } catch (error: any) {
        showToast(error.message, WidgetTypes.ALERT, theme)
      } finally {
        setIsLoadingSubmit(false)
        setInputFeedback({
          title: "",
          description: "",
          image: "",
          publicId: "",
        })
        setImage(null)
      }
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
        <div className="font-semibold text-lg sm:ms-8">Kirim Feedback</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-2">
        <div className="mb-6 flex justify-start items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Kirim Feedback</h1>
            <p className="text-soft-color">Untuk Basoin yang lebih baik</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-2/5 lg:w-4/5 md:w-full sm:w-full">
          <div className="bg-card-color p-6 rounded-lg flex flex-col gap-4">
            <InputField
              label="Judul"
              value={inputFeedback.title}
              id="title"
              name="title"
              onChange={(e) => {
                setInputFeedback({ ...inputFeedback, title: e.target.value })
              }}
              placeholder="Judul"
              required={true}
              type="text"
            />

            <TextArea
              label="Deskripsi"
              value={inputFeedback.description}
              id="description"
              name="description"
              onChange={(e) => {
                setInputFeedback({
                  ...inputFeedback,
                  description: e.target.value,
                })
              }}
              placeholder="Deskripsi"
              required={true}
              type="textarea"
            />

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
              <div className="flex flex-col gap-2">
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
              </div>
            )}

            <div className="flex gap-2 w-full justify-end">
              <PrimaryActionButton
                isLoading={isLoadingSubmit}
                ButtonIcon={isLoadingSubmit ? Loader : Check}
                text="Simpan"
                onClick={onSubmitFeedback}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
