"use client"
import Banner from "@/components/banner/Banner"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { SubjectWithIsFollowed, User } from "@/domain/domain"
import { getUserById } from "@/controllers/usersController"
import { getLastOpenedSubjects } from "@/controllers/subjectsController"
import SubjectCard from "@/components/cards/SubjectCardAdmin"
import { showToast } from "@/helpers/showToast"
import { WidgetTypes } from "@/constants/widgetTypes"
import { useTheme } from "next-themes"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"

export default function Page() {
  const { data } = useSession()
  const { theme } = useTheme()

  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    name: "",
    angkatan: 0,
    followedSubjects: [],
    createdAt: undefined,
    updatedAt: undefined,
  })

  const [isLoadingFetchUser, setIsLoadingFetchUser] = useState(true)
  const [isLoadingFetchSubjects, setIsLoadingFetchSubjects] = useState(true)
  const [subjects, setSubjects] = useState<SubjectWithIsFollowed[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchUser = async () => {
    if (data?.user?.id !== undefined) {
      const res = await getUserById(data?.user?.id)
      setUser(res.user)

      setIsLoadingFetchUser(false)
    }
  }

  const fetchLastOpenedSubjects = async () => {
    const lastOpenedSubject = localStorage.getItem("lastOpenedSubject")

    let parsedLastOpenedSubject = []
    if (lastOpenedSubject != null) {
      parsedLastOpenedSubject = JSON.parse(lastOpenedSubject)
    }

    try {
      const res = await getLastOpenedSubjects(parsedLastOpenedSubject)
      setSubjects(res.subjects)
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    } finally {
      setIsLoadingFetchSubjects(false)
    }
  }

  useEffect(() => {
    fetchLastOpenedSubjects()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [data])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">Dashboard</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-2">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {isLoadingFetchUser ? (
            <div className="h-5 w-72 animate-pulse rounded-lg bg-skeleton-color"></div>
          ) : (
            <p className="text-gray-400">
              Selamat datang kembali,{" "}
              <span className="font-semibold">{user.name}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-8">
          {isLoadingFetchUser ? (
            <div className="h-72 w-full animate-pulse rounded-lg bg-skeleton-color"></div>
          ) : (
            <Banner followedSubjectCount={user.followedSubjects.length} />
          )}

          <div className="flex flex-col">
            <h1 className="text-gray-400 font-semibold mb-4">
              Terakhir Anda Lihat
            </h1>

            {isLoadingFetchSubjects ? (
              <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
                <div className="h-48 w-full animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 w-full animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 w-full animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 w-full animate-pulse rounded-lg bg-skeleton-color"></div>
              </div>
            ) : (
              subjects !== undefined &&
              subjects.length > 0 && (
                <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      isFollowButtonHidden={true}
                    />
                  ))}
                </div>
              )
            )}

            {!isLoadingFetchSubjects && subjects === undefined && (
              <div className="flex p-4 flex-col items-center justify-center h-64 bg-card-color rounded-lg">
                <h1 className="text-gray-400 font-semibold mb-4 text-center">
                  Anda belum membuka mata kuliah apapun
                </h1>
                <p className="text-gray-400 text-center">
                  Anda dapat membuka mata kuliah dengan menekan tombol{" "}
                  <span className="font-semibold">Detail</span> pada mata kuliah
                  yang tersedia
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
