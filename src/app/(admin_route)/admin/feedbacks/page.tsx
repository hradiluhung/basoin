"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import TetriaryActionButton from "@/components/buttons/TetriaryActionButton"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { WidgetTypes } from "@/constants/widgetTypes"
import { getAllFeedbacks } from "@/controllers/feedbacksController"
import { Feedback } from "@/domain/domain"
import { useEffect, useState } from "react"
import { BookOpen, Image as ImageIcon, Maximize2, X } from "react-feather"
import Image from "next/image"

export default function Page() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoadingFetchFeedbacks, setIsLoadingFetchFeedbacks] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback>({
    _id: "",
    title: "",
    description: "",
    image: "",
    publicId: "",
    createdAt: undefined,
    updatedAt: undefined,
  })
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchFeedback = async () => {
    const res = await getAllFeedbacks()
    setFeedbacks(res.feedbacks)
    setIsLoadingFetchFeedbacks(false)
  }

  const onOpenDetailImage = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
  }

  const onCloseDetailImage = () => {
    setSelectedFeedback({
      _id: "",
      title: "",
      description: "",
      image: "",
      publicId: "",
      createdAt: undefined,
      updatedAt: undefined,
    })
  }

  useEffect(() => {
    fetchFeedback()
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
        <div className="font-semibold text-lg sm:ms-8">Feedback</div>
        <ToggleThemeButton />
      </div>
      <main className="flex flex-col h-full px-10 sm:px-4">
        {selectedFeedback._id !== "" && (
          <div className="fixed top-0 left-0 w-full h-full z-30 py-4 bg-black bg-opacity-50 flex justify-center items-center sm:px-2">
            <div className="max-h-full flex flex-col bg-card-color rounded-xl md:w-full sm:w-full w-1/2">
              <div className="flex justify-between items-center p-4 border-b border-b-border-color">
                <h1 className="text-2xl font-semibold">Detail Feedback</h1>
                <TetriaryActionButton
                  onClick={onCloseDetailImage}
                  ButtonIcon={X}
                />
              </div>

              <div className="flex h-full flex-col gap-4 p-6 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold opacity-50">Judul</p>
                  <h1 className="text-base">{selectedFeedback.title}</h1>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold opacity-50">
                    Deskripsi
                  </p>
                  <p className="text-base">{selectedFeedback.description}</p>
                </div>
                {selectedFeedback.image !== "" && (
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold opacity-50">Gambar</p>
                    <Image
                      src={selectedFeedback.image}
                      alt="feedback image"
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Feedback</h1>
            <p className="text-soft-color">
              Daftar feedback dari pengguna Basoin
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-grow mt-6">
          {/* show loading */}
          {isLoadingFetchFeedbacks && (
            <div className="flex flex-col rounded-lg overflow-hidden">
              <div className="h-20 animate-pulse bg-skeleton-color"></div>
              <div className="h-20 animate-pulse bg-skeleton-color"></div>
              <div className="h-20 animate-pulse bg-skeleton-color"></div>
              <div className="h-20 animate-pulse bg-skeleton-color"></div>
              <div className="h-20 animate-pulse bg-skeleton-color"></div>
            </div>
          )}

          {/* show empty */}
          {!isLoadingFetchFeedbacks && feedbacks.length === 0 && (
            <div className="flex-grow rounded-xl flex gap-4 flex-col justify-center items-center opacity-50">
              <BookOpen size={48} className="text-gray-400" />
              <p className="text-gray-400">Tidak ada feedback</p>
            </div>
          )}

          <div className="flex flex-col rounded-lg overflow-hidden">
            {/* show data */}
            {!isLoadingFetchFeedbacks &&
              feedbacks.length > 0 &&
              feedbacks.map((feedback, index) => (
                <div
                  key={feedback._id}
                  className={`${
                    feedbacks.indexOf(feedback) === feedbacks.length - 1
                      ? ""
                      : "border-b-2 border-mark-color"
                  } shadow-md bg-card-color overflow-hidden flex justify-between items-center p-4 md:flex-col md:items-start md:gap-2 sm:flex-col sm:items-start sm:gap-2`}
                >
                  <div className="flex basis-8/12 items-center gap-6 text-justify">
                    <div className="flex">
                      <span className="text-soft-color text-xl font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex flex-col basis-10/12">
                      <h1 className="text-lg font-semibold">
                        {feedback.title}
                      </h1>
                      <span className="text-soft-color opacity-50 line-clamp-2">
                        {feedback.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex basis-4/12 items-center justify-between md:w-full sm:w-full gap-6">
                    <div className="flex gap-2">
                      {feedback.image !== "" && (
                        <div className="flex justify-center items-center p-2 bg-mark-color rounded-full">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex flex-col opacity-50">
                        {feedback.createdAt !== undefined && (
                          <>
                            <span className="text-soft-color text-sm">
                              Dibuat Pada:
                            </span>
                            <span className="text-soft-color text-sm font-bold">
                              {new Date(feedback.createdAt).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <PrimaryActionButton
                        onClick={() => onOpenDetailImage(feedback)}
                        ButtonIcon={Maximize2}
                        type={WidgetTypes.NORMAL}
                      />
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
