"use client"

import SubjectCard from "@/components/cards/SubjectCardAdmin"
import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import SearchBar from "@/components/searchBar/SearchBar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { Semester } from "@/constants/subject"
import { ViewType } from "@/constants/viewType"
import { WidgetTypes } from "@/constants/widgetTypes"
import {
  getFollowedSubjectsByUserId,
  updateFollowedSubjects,
} from "@/controllers/subjectsController"
import { SubjectWithIsFollowed } from "@/domain/domain"
import { showToast } from "@/helpers/showToast"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useState } from "react"
import { Grid, List } from "react-feather"

export default function Page() {
  const { data } = useSession()
  const { theme } = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [subjects, setSubjects] = useState<SubjectWithIsFollowed[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [viewType, setViewType] = useState<ViewType>(ViewType.GRID)
  const [filteredSubjects, setFilteredSubjects] = useState<
    SubjectWithIsFollowed[]
  >([])
  const [listIsLoadingFollow, setListIsLoadingFollow] = useState<boolean[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const onUpdateFollowedSubjects = async (index: number, subjectId: string) => {
    if (data?.user?.id !== undefined) {
      try {
        setListIsLoadingFollow((prev) => {
          const newPrev = [...prev]
          newPrev[index] = true
          return newPrev
        })
        const res = await updateFollowedSubjects({
          userId: data?.user?.id,
          subjectId: subjectId,
        })

        showToast(res.message, WidgetTypes.SUCCESS, theme)

        const newSubjects = subjects.filter((subject) => {
          return subject._id !== subjectId
        })
        setSubjects(newSubjects)

        if (searchQuery !== "" || semesterFilter !== "") {
          const newFilteredSubjects = filteredSubjects.filter((subject) => {
            return subject._id !== subjectId
          })
          setFilteredSubjects(newFilteredSubjects)
        }

        setListIsLoadingFollow((prev) => {
          const newPrev = [...prev]
          newPrev[index] = false
          return newPrev
        })
      } catch (error: any) {
        showToast(error.message, WidgetTypes.ALERT, theme)
        setListIsLoadingFollow((prev) => {
          const newPrev = [...prev]
          newPrev[index] = false
          return newPrev
        })
      }
    }
  }

  const fetchSubjects = useCallback(async () => {
    if (data?.user?.id !== undefined) {
      setIsLoading(true)
      const res = await getFollowedSubjectsByUserId(data?.user?.id)

      setSubjects(res.subjects)
      setIsLoading(false)

      res.subjects.map(() => {
        setListIsLoadingFollow((prev) => [...prev, false])
      })
    }
  }, [data?.user?.id])

  const onFilterChange = useCallback(() => {
    const filtered = subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        subject.semester.includes(semesterFilter)
      )
    })
    setFilteredSubjects(filtered)
  }, [searchQuery, semesterFilter, subjects])

  const onChangeView = (viewType: ViewType) => {
    localStorage.setItem("viewType", viewType)
    setViewType(viewType)
  }

  const onInitializeViewType = () => {
    const viewType = localStorage.getItem("viewType")
    if (viewType === ViewType.LIST) {
      setViewType(ViewType.LIST)
    } else {
      setViewType(ViewType.GRID)
    }
  }

  useEffect(() => {
    onInitializeViewType()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [onFilterChange, searchQuery, semesterFilter])

  useEffect(() => {
    fetchSubjects()
  }, [data, fetchSubjects])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 100 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">Mata Kuliah Diikuti</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-2">
        <div className="mb-6 flex justify-start items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Mata Kuliah Diikuti</h1>
            <p className="text-soft-color">
              Daftar mata kuliah yang tersedia di bank soal
            </p>
          </div>
        </div>
        <div className="flex gap-4 justify-between md:flex-col sm:flex-col">
          <div className="flex gap-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Cari mata kuliah"
            />
            <DropDownFilter
              label="Semester"
              value={semesterFilter}
              placeholder="Semua Semester"
              listItem={Object.values(Semester)}
              setFilter={setSemesterFilter}
            />
          </div>
          <div className="flex justify-end">
            <div className="flex h-full justify-end items-center gap-2 border border-border-color rounded-lg">
              <button
                className={`${
                  viewType === ViewType.LIST
                    ? "bg-primary-color"
                    : "bg-mark-color text-primary-color"
                } h-full rounded-md px-4 py-2 font-semibold`}
                onClick={() => onChangeView(ViewType.GRID)}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                className={`${
                  viewType === ViewType.GRID
                    ? "bg-primary-color"
                    : "bg-mark-color text-primary-color"
                } h-full rounded-md px-4 py-2 font-semibold`}
                onClick={() => onChangeView(ViewType.LIST)}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {ViewType.GRID === viewType ? (
          <div className="mt-6">
            {isLoading && (
              <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
              </div>
            )}

            {/* show empty */}
            {searchQuery !== "" || semesterFilter !== ""
              ? filteredSubjects.length === 0 &&
                !isLoading && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">
                      Mata kuliah tidak ditemukan
                    </p>
                  </div>
                )
              : subjects.length === 0 &&
                !isLoading && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">Tidak ada mata kuliah</p>
                  </div>
                )}

            <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
              {searchQuery !== "" || semesterFilter !== ""
                ? filteredSubjects.length > 0 &&
                  filteredSubjects.map((subject, index) => (
                    <SubjectCard
                      isLoading={listIsLoadingFollow[index]}
                      isFollowed={subject.isFollowed}
                      key={subject._id}
                      subject={subject}
                      onUpdateFollowedSubjects={() => {
                        onUpdateFollowedSubjects(index, subject._id)
                      }}
                    />
                  ))
                : subjects.map((subject, index) => (
                    <SubjectCard
                      isLoading={listIsLoadingFollow[index]}
                      isFollowed={subject.isFollowed}
                      key={subject._id}
                      subject={subject}
                      onUpdateFollowedSubjects={() => {
                        onUpdateFollowedSubjects(index, subject._id)
                      }}
                    />
                  ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {isLoading && (
              <div className="flex flex-col gap-4">
                <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
                <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
              </div>
            )}

            {/* show empty */}
            {searchQuery !== "" || semesterFilter !== ""
              ? filteredSubjects.length === 0 &&
                !isLoading && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">
                      Mata kuliah tidak ditemukan
                    </p>
                  </div>
                )
              : subjects.length === 0 &&
                !isLoading && (
                  <div className="flex justify-center items-center">
                    <p className="text-soft-color">Tidak ada mata kuliah</p>
                  </div>
                )}

            <div className="flex flex-col gap-4">
              {searchQuery !== "" || semesterFilter !== ""
                ? filteredSubjects.length > 0 &&
                  filteredSubjects.map((subject, index) => (
                    <SubjectCard
                      isLoading={listIsLoadingFollow[index]}
                      isFollowed={subject.isFollowed}
                      key={subject._id}
                      subject={subject}
                      viewType={viewType}
                      onUpdateFollowedSubjects={() => {
                        onUpdateFollowedSubjects(index, subject._id)
                      }}
                    />
                  ))
                : subjects.map((subject, index) => (
                    <SubjectCard
                      isLoading={listIsLoadingFollow[index]}
                      isFollowed={subject.isFollowed}
                      key={subject._id}
                      subject={subject}
                      viewType={viewType}
                      onUpdateFollowedSubjects={() => {
                        onUpdateFollowedSubjects(index, subject._id)
                      }}
                    />
                  ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
