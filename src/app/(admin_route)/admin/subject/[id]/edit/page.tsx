"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import DropdownInput from "@/components/dropdownInput/DropdownInput"
import InputField from "@/components/inputField/InputField"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { Semester } from "@/constants/subject"
import { WidgetTypes } from "@/constants/widgetTypes"
import { updateSubject, getSubjectById } from "@/controllers/subjectsController"
import { showToast } from "@/helpers/showToast"
import { deletePhoto, uploadPhoto } from "@/helpers/uploadPhotos"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeftCircle, Check, Loader } from "react-feather"

export default function Page({ params }: { params: { id: string } }) {
  const { theme } = useTheme()
  const router = useRouter()

  const [image, setImage] = useState(null)
  const [subjectCode, setSubjectCode] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [subjectImageURL, setSubjectImageURL] = useState("")
  const [subjectPublicId, setSubjectPublicId] = useState("")
  const [semester, setSemester] = useState("")
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingInit, setIsLoadingInit] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const fetchSubject = async () => {
    const data = await getSubjectById(params.id.toString())

    setSubjectName(data.subject.name)
    setSubjectCode(data.subject.code)
    setSemester(data.subject.semester)
    setSubjectImageURL(data.subject.image)
    setSubjectPublicId(data.subject.publicId)

    setIsLoadingInit(false)
  }

  async function onChangeInputFile(e: any) {
    const file = e.target.files[0]
    setImage(file)
  }

  const onUpdateSubject = async (e: any) => {
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
      setIsLoadingSubmit(true)
      const formData = new FormData()
      let resUploadPhoto = null

      if (image == null && subjectImageURL == "") {
        await deletePhoto(subjectPublicId)
        const res = await updateSubject({
          id: params.id.toString(),
          code: subjectCode,
          name: subjectName,
          semester,
          image: "",
          publicId: "",
        })

        if (res.status === 200) {
          showToast(res.message, WidgetTypes.SUCCESS, theme)
          onBackToPreviousScreen()
        } else {
          showToast(res.message, WidgetTypes.ALERT, theme)
          setIsLoadingSubmit(false)
        }
        return
      }

      if (subjectImageURL == "") {
        await deletePhoto(subjectPublicId)
      }

      if (image != null) {
        formData.append("file", image)
        resUploadPhoto = await uploadPhoto(formData)
      }

      const res = await updateSubject({
        id: params.id.toString(),
        code: subjectCode,
        name: subjectName,
        semester,
        image: resUploadPhoto?.data?.url || subjectImageURL || "",
        publicId: resUploadPhoto?.data?.publicId || subjectPublicId || "",
      })

      if (res.status === 200) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        onBackToPreviousScreen()
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
        setIsLoadingSubmit(false)
      }
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    }
  }

  const deleteImage = () => {
    setImage(null)
    setSubjectImageURL("")
  }

  useEffect(() => {
    fetchSubject()
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
        <div className="font-semibold text-lg sm:ms-8">Edit Mata Kuliah</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-4">
        <div className="mb-6 gap-4">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <ArrowLeftCircle
              className="w-6 h-6 cursor-pointer"
              onClick={onBackToPreviousScreen}
            />
            <h1>Edit Mata Kuliah</h1>
          </div>
        </div>
        <div className="flex">
          {isLoadingInit ? (
            <div className="h-96 basis-1/3 lg:basis-1/2 md:basis-full sm:basis-full animate-pulse rounded-md bg-skeleton-color mb-2"></div>
          ) : (
            <form
              onSubmit={onUpdateSubject}
              className="basis-1/3 flex flex-col p-4 bg-card-color rounded-xl shadow-md lg:basis-1/2 md:basis-full sm:basis-full"
              method="post"
              encType="multipart/form-data"
            >
              <div className="mb-4">
                {image == null && subjectImageURL == "" ? (
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
                        src={
                          image != null
                            ? URL.createObjectURL(image)
                            : subjectImageURL
                        }
                        alt="Cover Mata Kuliah"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        className="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded-md"
                        type="button"
                        onClick={deleteImage}
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
                  text="Simpan"
                  isSubmit={true}
                  ButtonIcon={isLoadingSubmit ? Loader : Check}
                  isLoading={isLoadingSubmit}
                />
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
