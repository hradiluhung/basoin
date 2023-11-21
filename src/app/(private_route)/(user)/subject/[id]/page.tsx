"use client"
import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import { WidgetTypes } from "@/constants/widgetTypes"
import { PaketTypes, Semester } from "@/constants/subject"
import {
  getAllQuestionsBySubjectId,
  getSubjectWithIsFollowedByUserById,
  updateFollowedSubjects,
} from "@/controllers/subjectsController"
import { showToast } from "@/helpers/showToast"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeftCircle, BookOpen, UserCheck } from "react-feather"
import { QnaWithYearAndType, SubjectWithIsFollowed } from "@/domain/domain"
import FollowButton from "@/components/buttons/FollowButton"
import { useSession } from "next-auth/react"
import SearchBar from "@/components/searchBar/SearchBar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import Image from "next/image"

export default function Page({ params }: { params: { id: string } }) {
  const { theme } = useTheme()
  const router = useRouter()
  const { data } = useSession()

  const [subject, setSubject] = useState<SubjectWithIsFollowed>({
    _id: "",
    name: "",
    semester: "",
    code: "",
    image: "",
    publicId: "",
    followers: [],
    numberOfQnA: 0,
    createdAt: undefined,
    updatedAt: undefined,
    isFollowed: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [isLoadingSubject, setIsLoadingSubject] = useState(true)
  const [isLoadingQnas, setIsLoadingQnas] = useState(true)
  const [qnas, setQnas] = useState<QnaWithYearAndType[]>([])
  const [filteredQnas, setFilteredQnas] = useState<QnaWithYearAndType[]>([])
  const [years, setYears] = useState<number[]>([])
  const [filterYear, setFilterYear] = useState("")
  const [filterPaketType, setFilterPaketType] = useState("")
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchSubject = async () => {
    if (data?.user?.id !== undefined) {
      const res = await getSubjectWithIsFollowedByUserById({
        subjectId: params.id,
        userId: data?.user?.id,
      })
      setSubject(res.subject)

      setIsLoadingSubject(false)
    }
  }

  const fetchQuestions = async () => {
    const res = await getAllQuestionsBySubjectId(params.id)

    const years = Array.from(
      new Set(res.questions.map((question: any) => question.year))
    ) as number[]

    setYears(years)
    setQnas(res.questions)
    setIsLoadingQnas(false)
  }

  const fetchAllData = async () => {
    await fetchSubject()
    await fetchQuestions()
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const onFilterChange = () => {
    let filteredQnas = qnas
    if (filterYear !== "") {
      filteredQnas = filteredQnas.filter(
        (qna) => qna.year === parseInt(filterYear)
      )
    }

    if (filterPaketType !== "") {
      filteredQnas = filteredQnas.filter((qna) => qna.type === filterPaketType)
    }

    if (searchQuery !== "") {
      filteredQnas = filteredQnas.filter((qna) =>
        qna.question
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim())
      )
    }

    setFilteredQnas(filteredQnas)
  }

  const onUpdateFollowedSubjects = async () => {
    if (data?.user?.id !== undefined) {
      try {
        setIsLoadingFollow(true)
        const res = await updateFollowedSubjects({
          userId: data?.user?.id,
          subjectId: params.id,
        })
        setSubject({
          ...subject,
          isFollowed: !subject.isFollowed,
          followers: res.subject.followers,
        })
        showToast(res.message, WidgetTypes.SUCCESS, theme)

        setIsLoadingFollow(false)
      } catch (error: any) {
        showToast(error.message, WidgetTypes.ALERT, theme)
        setIsLoadingFollow(false)
      }
    }
  }

  // update last opened subject in local storage and remove the earlier one if it's more than 4
  const updateLastOpenedSubject = () => {
    const lastOpenedSubject = localStorage.getItem("lastOpenedSubject")
    if (lastOpenedSubject !== null) {
      const lastOpenedSubjectList = JSON.parse(lastOpenedSubject)
      const isSubjectExist = lastOpenedSubjectList.find(
        (subjectId: string) => subjectId === params.id
      )

      if (isSubjectExist === undefined) {
        if (lastOpenedSubjectList.length === 4) {
          lastOpenedSubjectList.shift()
        }
        lastOpenedSubjectList.push(params.id)
        localStorage.setItem(
          "lastOpenedSubject",
          JSON.stringify(lastOpenedSubjectList)
        )
      }
    } else {
      localStorage.setItem("lastOpenedSubject", JSON.stringify([params.id]))
    }
  }

  useEffect(() => {
    updateLastOpenedSubject()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [filterYear, filterPaketType, searchQuery])

  useEffect(() => {
    fetchAllData()
  }, [data])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 100 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">{subject.name}</div>
        <ToggleThemeButton />
      </div>
      <main className="flex flex-col h-full px-10 sm:px-2">
        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div className="flex flex-col justify-start">
            <div className="flex gap-2 items-start">
              <ArrowLeftCircle
                className="w-6 h-6 cursor-pointer mt-2"
                onClick={onBackToPreviousScreen}
              />
              {isLoadingSubject ? (
                <div className="flex flex-col">
                  <div className="h-6 w-40 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-8 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                    <div className="h-4 w-8 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex gap-2">
                      <h1 className="text-2xl font-semibold">{subject.name}</h1>
                      <FollowButton
                        isFollowed={subject.isFollowed}
                        onClick={onUpdateFollowedSubjects}
                        isLoading={isLoadingFollow}
                      />
                    </div>
                    <p className="text-soft-color">
                      <span className="text-soft-color">{subject.code} </span>
                      <span className="text-soft-color">
                        -{" "}
                        {subject.semester === Semester.PILIHAN
                          ? "Matkul"
                          : "Semester"}{" "}
                        {subject.semester}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 opacity-50">
                      <UserCheck className="w-3 h-3 stroke-text-color" />
                      <span className="text-soft-color text-sm">
                        {subject.followers.length} Follower
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <BookOpen className="w-3 h-3 stroke-text-color" />
                      <span className="text-soft-color text-sm">
                        {subject.numberOfQnA} Pertanyaan
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-grow justify-start items-center flex-col gap-6 w-3/5 mx-auto lg:w-4/5 md:w-full sm:w-full">
          <div className="flex justify-between gap-2 w-full md:flex-col sm:flex-col">
            <div className="flex flex-start gap-2">
              <DropDownFilter
                label="input-tipe-paket"
                listItem={Object.values(PaketTypes).sort((a, b) =>
                  a > b ? -1 : 1
                )}
                value={filterPaketType}
                placeholder="UTS dan UAS"
                setFilter={setFilterPaketType}
              />
              <DropDownFilter
                label="input-tahun"
                listItem={years}
                value={filterYear}
                placeholder="Semua Tahun"
                setFilter={setFilterYear}
              />
            </div>
            <div>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Cari soal atau jawaban"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            {/* show loading */}
            {isLoadingQnas && (
              <div className="flex flex-col gap-6 w-full">
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
              </div>
            )}

            {/* show empty */}
            {filterYear !== "" || filterPaketType !== "" || searchQuery !== ""
              ? filteredQnas.length === 0 &&
                !isLoadingQnas && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">
                      Tidak ada pertanyaan yang sesuai dengan filter yang anda
                      pilih
                    </p>
                  </div>
                )
              : qnas.length === 0 &&
                !isLoadingQnas && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">
                      Tidak ada pertanyaan yang tersedia
                    </p>
                  </div>
                )}

            {/* show data */}
            <div className="flex flex-col gap-6 w-full">
              {filterYear !== "" || filterPaketType !== "" || searchQuery !== ""
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
                        <div className="flex gap-2">
                          <p className="text-gray-500 bg-border-color px-2 rounded-md">
                            {qna.year}
                          </p>
                          <p className="text-gray-500 bg-border-color px-2 rounded-md">
                            {qna.type}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-6">
                        <div className="flex gap-2 flex-col w-full">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                              Pertanyaan
                            </span>
                            <span className="text-basic-color text-lg">
                              {qna.question}
                            </span>
                          </div>
                          {qna.questionImage !== "" && (
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              // onClick={() => {
                              //   showImageDetail(index, "question")
                              // }}
                              src={qna.questionImage}
                              alt="question"
                              className="w-2/3 h-48 mx-auto rounded-lg object-cover cursor-pointer md:w-full sm:w-full"
                            />
                          )}
                        </div>
                        <div className="flex gap-2 flex-col w-full">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-gray-500 rounded-3xl text-sm px-2 bg-mark-color">
                              Jawaban
                            </span>
                            <span className="text-basic-color text-lg">
                              {qna.answer}
                            </span>
                          </div>
                          {qna.answerImage !== "" && (
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              // onClick={() => {
                              //   showImageDetail(index, "answer")
                              // }}
                              src={qna.answerImage}
                              alt="answer"
                              className="w-2/3 h-48 mx-auto rounded-lg object-cover cursor-pointer md:w-full sm:w-full"
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
                        <div className="flex gap-2">
                          <p className="text-gray-500 bg-border-color px-2 rounded-md">
                            {qna.year}
                          </p>
                          <p className="text-gray-500 bg-border-color px-2 rounded-md">
                            {qna.type}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-6">
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
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              // onClick={() => {
                              //   showImageDetail(index, "question")
                              // }}
                              src={qna.questionImage}
                              alt="question"
                              className="w-2/3 h-48 mx-auto rounded-lg object-cover cursor-pointer md:w-full sm:w-full"
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
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              // onClick={() => {
                              //   showImageDetail(index, "answer")
                              // }}
                              src={qna.answerImage}
                              alt="answer"
                              className="w-2/3 h-48 mx-auto rounded-lg object-cover cursor-pointer md:w-full sm:w-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
