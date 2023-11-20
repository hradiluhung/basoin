"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton"
import TetriaryActionButton from "@/components/buttons/TetriaryActionButton"
import ModalAlert from "@/components/modal/ModalAlert"
import ModalForm from "@/components/modal/ModalForm"
import SearchBar from "@/components/searchBar/SearchBar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { WidgetTypes } from "@/constants/widgetTypes"
import {
  deletePaketByPaketId,
  getPaketByPaketId,
} from "@/controllers/paketsController"
import {
  createQnaByPaketId,
  deleteQnaByQnaId,
  getAllQnasByPaketId,
  updateQnaByQnaId,
} from "@/controllers/qnasController"
import { getSubjectById } from "@/controllers/subjectsController"
import { Paket, Qna, Subject } from "@/domain/domain"
import { showToast } from "@/helpers/showToast"
import { deletePhoto, uploadPhoto } from "@/helpers/uploadPhotos"
import { useTheme } from "next-themes"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeftCircle,
  Edit2,
  Loader,
  PlusCircle,
  Trash2,
  X,
} from "react-feather"

export default function Page({
  params,
}: {
  params: { id: string; paketId: string }
}) {
  const router = useRouter()
  const { theme } = useTheme()

  const [paket, setPaket] = useState<Paket>({
    _id: "",
    year: 0,
    type: "",
  })
  const [subject, setSubject] = useState<Subject>({
    _id: "",
    name: "",
    semester: "",
    code: "",
    image: "",
    publicId: "",
    followers: [],
    numberOfQnA: 0,
  })
  const [isLoadingPaketsAndSubject, setIsLoadingPaketsAndSubject] =
    useState(true)
  const [isLoadingQnas, setIsLoadingQnas] = useState(true)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isDeletePaketModalOpen, setIsDeletePaketModalOpen] = useState(false)
  const [isDeleteQnaModalOpen, setIsDeleteQnaModalOpen] = useState(false)
  const [isEditQnaModalOpen, setIsEditQnaModalOpen] = useState(false)
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [qnas, setQnas] = useState<Qna[]>([])
  const [filteredQnas, setFilteredQnas] = useState<Qna[]>([])
  const [selectedDeleteQna, setSelectedDeleteQna] = useState<Qna>({
    _id: "",
    question: "",
    questionImage: "",
    publicIdQuestionImage: "",
    answer: "",
    answerImage: "",
    publicIdAnswerImage: "",
  })
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [questionImage, setQuestionImage] = useState(null)
  const [answerImage, setAnswerImage] = useState(null)
  const [openedImageDetail, setOpenedImageDetail] = useState<{
    index: number
    type: string
  }>({
    index: -1,
    type: "",
  })
  const [selectedEditQna, setSelectedEditQna] = useState<Qna>({
    _id: "",
    question: "",
    questionImage: "",
    publicIdQuestionImage: "",
    answer: "",
    answerImage: "",
    publicIdAnswerImage: "",
  })
  const [existedImage, setExistedImage] = useState({
    questionImage: "",
    publicIdQuestionImage: "",
    answerImage: "",
    publicIdAnswerImage: "",
  })
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchPaketsAndSubject = async () => {
    const resPakets = await getPaketByPaketId(params.paketId.toString())
    setPaket(resPakets.paket)

    const resSubject = await getSubjectById(params.id.toString())
    setSubject(resSubject.subject)

    setIsLoadingPaketsAndSubject(false)
  }

  const fetchQnas = async () => {
    const dataQnas = await getAllQnasByPaketId(params.paketId.toString())
    setQnas(dataQnas.qnas)

    setIsLoadingQnas(false)
  }

  const fetchAllData = async () => {
    await fetchPaketsAndSubject()
    await fetchQnas()
  }

  const onDeletePaket = async () => {
    setIsLoadingDelete(true)

    const res = await deletePaketByPaketId(params.paketId.toString())

    if (res.status === 200) {
      showToast(res.message, WidgetTypes.SUCCESS, theme)
    } else {
      showToast(res.message, WidgetTypes.ALERT, theme)
    }

    setIsDeletePaketModalOpen(false)
    setIsLoadingDelete(false)
    onBackToPreviousScreen()
  }

  const onSubmitAddQuestion = async (e: any) => {
    e.preventDefault()

    if (question === "" || answer === "") {
      showToast("Pertanyaan dan jawaban harus diisi!", WidgetTypes.ALERT, theme)
      return
    }

    try {
      setIsLoadingSubmit(true)
      const formDataQuestion = new FormData()
      const formDataAnswer = new FormData()

      let resUploadQuestionImage = null
      let resUploadAnswerImage = null

      if (questionImage != null) {
        formDataQuestion.append("file", questionImage)
        resUploadQuestionImage = await uploadPhoto(formDataQuestion)
      }

      if (answerImage != null) {
        formDataAnswer.append("file", answerImage)
        resUploadAnswerImage = await uploadPhoto(formDataAnswer)
      }

      const res = await createQnaByPaketId({
        paketId: params.paketId.toString(),
        question: question,
        answer: answer,
        questionImage:
          resUploadQuestionImage != null && resUploadQuestionImage.data != null
            ? resUploadQuestionImage.data.url
            : "",
        answerImage:
          resUploadAnswerImage != null && resUploadAnswerImage.data != null
            ? resUploadAnswerImage.data.url
            : "",
        publicIdQuestionImage:
          resUploadQuestionImage != null && resUploadQuestionImage.data != null
            ? resUploadQuestionImage.data.publicId
            : "",
        publicIdAnswerImage:
          resUploadAnswerImage != null && resUploadAnswerImage.data != null
            ? resUploadAnswerImage.data.publicId
            : "",
        subjectId: params.id.toString(),
      })

      if (res.status === 201) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        setQnas(qnas.concat(res.qna))
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }

      onCloseAddQuestionModal()
      setIsLoadingSubmit(false)
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
      setIsLoadingSubmit(false)
    }
  }

  const onSubmitEditQuestion = async (e: any) => {
    e.preventDefault()

    if (selectedEditQna.question === "" || selectedEditQna.answer === "") {
      showToast("Pertanyaan dan jawaban harus diisi!", WidgetTypes.ALERT, theme)
      return
    }

    try {
      setIsLoadingSubmit(true)

      const formDataQuestion = new FormData()
      const formDataAnswer = new FormData()
      let resUploadQuestionImage = null
      let resUploadAnswerImage = null

      if (questionImage != null && existedImage.questionImage !== "") {
        await deletePhoto(existedImage.publicIdQuestionImage)
        formDataQuestion.append("file", questionImage)
        resUploadQuestionImage = await uploadPhoto(formDataQuestion)
      }

      if (answerImage != null && existedImage.answerImage !== "") {
        await deletePhoto(existedImage.publicIdAnswerImage)
        formDataAnswer.append("file", answerImage)
        resUploadAnswerImage = await uploadPhoto(formDataAnswer)
      }

      if (
        existedImage.answerImage !== "" &&
        selectedEditQna.answerImage === ""
      ) {
        await deletePhoto(existedImage.publicIdAnswerImage)
      }

      if (
        existedImage.questionImage !== "" &&
        selectedEditQna.questionImage === ""
      ) {
        await deletePhoto(existedImage.publicIdQuestionImage)
      }

      if (questionImage != null && existedImage.questionImage === "") {
        formDataQuestion.append("file", questionImage)
        resUploadQuestionImage = await uploadPhoto(formDataQuestion)
      }

      if (answerImage != null && existedImage.answerImage === "") {
        formDataAnswer.append("file", answerImage)
        resUploadAnswerImage = await uploadPhoto(formDataAnswer)
      }

      const res = await updateQnaByQnaId({
        id: selectedEditQna._id.toString(),
        question: selectedEditQna.question,
        answer: selectedEditQna.answer,
        questionImage:
          resUploadQuestionImage != null && resUploadQuestionImage.data != null
            ? resUploadQuestionImage.data.url
            : existedImage.answerImage !== "" &&
              selectedEditQna.answerImage === ""
            ? ""
            : selectedEditQna.questionImage,
        answerImage:
          resUploadAnswerImage != null && resUploadAnswerImage.data != null
            ? resUploadAnswerImage.data.url
            : existedImage.answerImage !== "" &&
              selectedEditQna.answerImage === ""
            ? ""
            : selectedEditQna.answerImage,
        publicIdQuestionImage:
          resUploadQuestionImage != null && resUploadQuestionImage.data != null
            ? resUploadQuestionImage.data.publicId
            : existedImage.answerImage !== "" &&
              selectedEditQna.answerImage === ""
            ? ""
            : selectedEditQna.publicIdQuestionImage,
        publicIdAnswerImage:
          resUploadAnswerImage != null && resUploadAnswerImage.data != null
            ? resUploadAnswerImage.data.publicId
            : existedImage.answerImage !== "" &&
              selectedEditQna.answerImage === ""
            ? ""
            : selectedEditQna.publicIdAnswerImage,
      })

      if (res.status === 200) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        setQnas(
          qnas.map((qna) => (qna._id === selectedEditQna._id ? res.qna : qna))
        )
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }

      onCloseEditQnaModal()
      setIsLoadingSubmit(false)
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
      setIsLoadingSubmit(false)
    }
  }

  const onCloseEditQnaModal = () => {
    setSelectedEditQna({
      _id: "",
      question: "",
      questionImage: "",
      publicIdQuestionImage: "",
      answer: "",
      answerImage: "",
      publicIdAnswerImage: "",
    })

    setIsEditQnaModalOpen(false)
  }

  const onCloseAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false)
    setQuestion("")
    setAnswer("")
    setQuestionImage(null)
    setAnswerImage(null)
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const showImageDetail = (index: number, type: string) => {
    setOpenedImageDetail({
      index: index,
      type: type,
    })
  }

  const closeImageDetail = () => {
    setOpenedImageDetail({
      index: -1,
      type: "",
    })
  }

  const onDeleteQna = async () => {
    setIsLoadingDelete(true)

    await deletePhoto(selectedDeleteQna.publicIdQuestionImage)
    await deletePhoto(selectedDeleteQna.publicIdAnswerImage)

    try {
      const res = await deleteQnaByQnaId(selectedDeleteQna._id.toString())
      if (res.status === 200) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        setQnas(qnas.filter((qna) => qna._id !== selectedDeleteQna._id))
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    } finally {
      setIsDeletePaketModalOpen(false)
      setIsLoadingDelete(false)
      setIsDeleteQnaModalOpen(false)
    }
  }

  const onFilterChange = () => {
    const filtered = qnas.filter((qna) => {
      return (
        qna.question
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        qna.answer
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim())
      )
    })

    setFilteredQnas(filtered)
  }

  useEffect(() => {
    fetchAllData()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [searchQuery])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        {isLoadingPaketsAndSubject ? (
          <div className="h-4 w-36 animate-pulse rounded-md bg-skeleton-color sm:ms-8"></div>
        ) : (
          <div className="flex flex-col gap-1 sm:ms-8">
            <p className="font-semibold text-base">
              {paket.year} - {paket.type}
            </p>

            <div className="font-semibold text-sm">{subject.name}</div>
          </div>
        )}
        <ToggleThemeButton />
      </div>
      <main className="flex flex-col h-full px-10 sm:px-4">
        {openedImageDetail.index !== -1 && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="h-5/6 bg-white rounded-lg flex flex-col justify-center items-center relative">
              {openedImageDetail.type === "question" ? (
                <img
                  src={qnas[openedImageDetail.index].questionImage}
                  alt="question"
                  className="w-auto h-full rounded-lg object-cover"
                />
              ) : (
                <img
                  src={qnas[openedImageDetail.index].answerImage}
                  alt="answer"
                  className="w-auto h-full rounded-lg object-cover"
                />
              )}
              <div className="absolute top-1 right-1">
                <PrimaryActionButton
                  onClick={closeImageDetail}
                  ButtonIcon={X}
                  type={WidgetTypes.ALERT}
                />
              </div>
            </div>
          </div>
        )}

        {isAddQuestionModalOpen && (
          <ModalForm
            inputList={[
              {
                label: "Pertanyaan",
                placeholder: "Isi pertanyaan",
                value: question,
                type: "text",
                onChange: (e: any) => {
                  setQuestion(e.target.value)
                },
                required: true,
                isTextArea: true,
              },
              {
                label: "Gambar Pertanyaan",
                placeholder: "Gambar Pertanyaan",
                value: questionImage,
                type: "file",
                onChange: (e: any) => {
                  setQuestionImage(e.target.files[0])
                },
                file: questionImage,
                setFile: setQuestionImage,
                required: false,
              },
              {
                label: "Jawaban",
                placeholder: "Isi Jawaban",
                value: answer,
                type: "text",
                onChange: (e: any) => {
                  setAnswer(e.target.value)
                },
                required: true,
                isTextArea: true,
              },
              {
                label: "Gambar Jawaban",
                placeholder: "Gambar Jawaban",
                value: answerImage,
                type: "file",
                onChange: (e: any) => {
                  setAnswerImage(e.target.files[0])
                },
                file: answerImage,
                setFile: setAnswerImage,
                required: false,
              },
            ]}
            onCloseModal={onCloseAddQuestionModal}
            onSubmit={(e: any) => {
              onSubmitAddQuestion(e)
            }}
            title="Tambah Soal"
            isLoading={isLoadingSubmit}
            size="large"
          />
        )}

        {isEditQnaModalOpen && (
          <ModalForm
            inputList={[
              {
                label: "Pertanyaan",
                placeholder: "Isi pertanyaan",
                value: selectedEditQna.question,
                type: "text",
                onChange: (e: any) => {
                  setSelectedEditQna({
                    ...selectedEditQna,
                    question: e.target.value,
                  })
                },
                required: true,
                isTextArea: true,
              },
              {
                label: "Gambar Pertanyaan",
                placeholder: "Gambar Pertanyaan",
                value: questionImage,
                type: "file",
                onChange: (e: any) => {
                  setQuestionImage(e.target.files[0])
                },
                file: questionImage,
                setFile: setQuestionImage,
                required: false,
                existedImage: selectedEditQna.questionImage,
                resetExistedImage: () => {
                  setSelectedEditQna({
                    ...selectedEditQna,
                    questionImage: "",
                  })
                },
              },
              {
                label: "Jawaban",
                placeholder: "Isi Jawaban",
                value: selectedEditQna.answer,
                type: "text",
                onChange: (e: any) => {
                  setSelectedEditQna({
                    ...selectedEditQna,
                    answer: e.target.value,
                  })
                },
                required: true,
                isTextArea: true,
              },
              {
                label: "Gambar Jawaban",
                placeholder: "Gambar Jawaban",
                value: answerImage,
                type: "file",
                onChange: (e: any) => {
                  setAnswerImage(e.target.files[0])
                },
                file: answerImage,
                setFile: setAnswerImage,
                required: false,
                existedImage: selectedEditQna.answerImage,
                resetExistedImage: () => {
                  setSelectedEditQna({
                    ...selectedEditQna,
                    answerImage: "",
                  })
                },
              },
            ]}
            onCloseModal={onCloseEditQnaModal}
            onSubmit={(e: any) => {
              onSubmitEditQuestion(e)
            }}
            title="Edit Soal"
            isLoading={isLoadingSubmit}
            size="large"
          />
        )}

        {isDeletePaketModalOpen && (
          <ModalAlert
            closeAction={() => {
              setIsDeletePaketModalOpen(false)
            }}
            primaryAction={onDeletePaket}
            isLoading={isLoadingDelete}
            primaryText="Hapus"
            title={`Apakah yakin ingin menghapus paket ${paket.year} - ${paket.type} dari ${subject.name} ?`}
            closeText="Batal"
            primaryIcon={isLoadingDelete ? Loader : Trash2}
            primaryTypes={WidgetTypes.ALERT}
            secondaryIcon={X}
          />
        )}

        {isDeleteQnaModalOpen && (
          <ModalAlert
            closeAction={() => {
              setIsDeleteQnaModalOpen(false)
            }}
            primaryAction={() => {
              onDeleteQna()
            }}
            primaryText="Hapus"
            title="Apakah yakin ingin menghapus soal ini?"
            closeText="Batal"
            isLoading={isLoadingDelete}
            primaryIcon={isLoadingDelete ? Loader : Trash2}
            primaryTypes={WidgetTypes.ALERT}
            secondaryIcon={X}
          />
        )}

        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 items-start">
              <ArrowLeftCircle
                className="w-6 h-6 cursor-pointer mt-2"
                onClick={onBackToPreviousScreen}
              />
              {isLoadingPaketsAndSubject ? (
                <div className="flex flex-col">
                  <div className="h-6 w-40 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <h1 className="text-2xl font-semibold">
                      {paket.year} - {paket.type}
                    </h1>
                    <p className="text-soft-color">{subject.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <SecondaryActionButton
              ButtonIcon={Trash2}
              text="Hapus"
              onClick={() => {
                setIsDeletePaketModalOpen(true)
              }}
              type={WidgetTypes.ALERT}
            />
          </div>
        </div>

        <div className="flex flex-grow justify-start items-center flex-col gap-6 w-3/5 mx-auto lg:w-4/5 md:w-full sm:w-full">
          <div className="w-full flex justify-between">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Cari soal atau jawaban"
            />
            <PrimaryActionButton
              ButtonIcon={PlusCircle}
              onClick={() => {
                setIsAddQuestionModalOpen(true)
              }}
              text="Tambah"
            />
          </div>

          {/* show loading */}
          {isLoadingQnas && (
            <div className="flex flex-col gap-6 w-full">
              <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
              <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
              <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
            </div>
          )}

          {/* show empty */}
          {searchQuery !== ""
            ? filteredQnas.length === 0 &&
              !isLoadingQnas && (
                <div className="flex justify-center items-center">
                  <p className="text-soft-color">
                    Soal atau jawaban tidak ditemukan
                  </p>
                </div>
              )
            : qnas.length === 0 &&
              !isLoadingQnas && (
                <div className="flex justify-center items-center">
                  <p className="text-soft-color">Tidak ada soal dan jawaban</p>
                </div>
              )}

          {/* show data */}
          <div className="flex flex-col gap-6 w-full">
            {searchQuery !== ""
              ? filteredQnas.length > 0 &&
                filteredQnas.map((qna, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full bg-card-color rounded-xl shadow-md"
                  >
                    <div className="flex justify-between items-center border-b border-border-color px-6 py-2">
                      <h1 className="text-soft-color text-xl font-semibold">
                        {index + 1}
                      </h1>
                      <div className="flex relative -right-4">
                        <TetriaryActionButton
                          ButtonIcon={Edit2}
                          onClick={() => {
                            setSelectedEditQna(qna)
                            setExistedImage({
                              questionImage: qna.questionImage,
                              answerImage: qna.answerImage,
                              publicIdQuestionImage: qna.publicIdQuestionImage,
                              publicIdAnswerImage: qna.publicIdAnswerImage,
                            })
                            setIsEditQnaModalOpen(true)
                          }}
                        />
                        <TetriaryActionButton
                          ButtonIcon={Trash2}
                          onClick={() => {
                            setIsDeleteQnaModalOpen(true)
                            setSelectedDeleteQna(qna)
                          }}
                          type={WidgetTypes.ALERT}
                        />
                      </div>
                    </div>
                    <div className="px-6 py-4 flex flex-col gap-4">
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                            Pertanyaan
                          </span>
                          <span className="text-basic-color text-lg font-normal">
                            {qna.question}
                          </span>
                        </div>
                        {qna.questionImage !== "" && (
                          <img
                            onClick={() => {
                              showImageDetail(index, "question")
                            }}
                            src={qna.questionImage}
                            alt="question"
                            className="w-full h-48 rounded-lg object-cover cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                            Jawaban
                          </span>
                          <span className="text-basic-color text-lg font-normal">
                            {qna.answer}
                          </span>
                        </div>
                        {qna.answerImage !== "" && (
                          <img
                            onClick={() => {
                              showImageDetail(index, "answer")
                            }}
                            src={qna.answerImage}
                            alt="answer"
                            className="w-full h-48 rounded-lg object-cover cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : qnas.length > 0 &&
                qnas.map((qna, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full bg-card-color rounded-xl shadow-md"
                  >
                    <div className="flex justify-between items-center border-b border-border-color px-6 py-2">
                      <h1 className="text-soft-color text-xl font-semibold">
                        {index + 1}
                      </h1>
                      <div className="flex relative -right-4">
                        <TetriaryActionButton
                          ButtonIcon={Edit2}
                          onClick={() => {
                            setSelectedEditQna(qna)
                            setExistedImage({
                              questionImage: qna.questionImage,
                              answerImage: qna.answerImage,
                              publicIdQuestionImage: qna.publicIdQuestionImage,
                              publicIdAnswerImage: qna.publicIdAnswerImage,
                            })
                            setIsEditQnaModalOpen(true)
                          }}
                        />
                        <TetriaryActionButton
                          ButtonIcon={Trash2}
                          onClick={() => {
                            setIsDeleteQnaModalOpen(true)
                            setSelectedDeleteQna(qna)
                          }}
                          type={WidgetTypes.ALERT}
                        />
                      </div>
                    </div>
                    <div className="px-6 py-4 flex flex-col gap-4">
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                            Pertanyaan
                          </span>
                          <span className="text-basic-color text-lg font-semibold">
                            {qna.question}
                          </span>
                        </div>
                        {qna.questionImage !== "" && (
                          <img
                            onClick={() => {
                              showImageDetail(index, "question")
                            }}
                            src={qna.questionImage}
                            alt="question"
                            className="w-full h-48 rounded-lg object-cover cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                            Jawaban
                          </span>
                          <span className="text-basic-color text-lg font-semibold">
                            {qna.answer}
                          </span>
                        </div>
                        {qna.answerImage !== "" && (
                          <img
                            onClick={() => {
                              showImageDetail(index, "answer")
                            }}
                            src={qna.answerImage}
                            alt="answer"
                            className="w-full h-48 rounded-lg object-cover cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </main>
    </>
  )
}
