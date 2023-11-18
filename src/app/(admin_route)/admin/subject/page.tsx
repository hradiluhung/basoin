"use client"

import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import PrimaryNavButton from "@/components/buttons/PrimaryNavButton"
import SearchBar from "@/components/searchBar/SearchBar"
import SubjectCard from "@/components/cards/SubjectCardAdmin"
import { getAllSubjects } from "@/controllers/subjectsController"
import React, { useEffect, useState } from "react"
import { Grid, List, PlusCircle } from "react-feather"
import { Semester } from "@/constants/subject"
import { Subject } from "@/domain/domain"
import { Role } from "@/constants/role"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { ViewType } from "@/constants/viewType"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [semesterFilter, setSemesterFilter] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [viewType, setViewType] = useState<ViewType>(ViewType.GRID)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchSubjects = async () => {
    const res = await getAllSubjects()

    setSubjects(res.subjects)

    setIsLoading(false)
  }

  const onFilterChange = () => {
    const filtered = subjects.filter((subject) => {
      return (
        subject.name
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) &&
        subject.semester.includes(semesterFilter)
      )
    })
    setFilteredSubjects(filtered)
  }

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
    fetchSubjects()
    onInitializeViewType()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [searchQuery, semesterFilter])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">Mata Kuliah</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-4">
        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Mata Kuliah</h1>
            <p className="text-soft-color">
              Daftar mata kuliah yang tersedia di bank soal
            </p>
          </div>
          <div>
            <PrimaryNavButton
              ButtonIcon={PlusCircle}
              href="/admin/subject/add"
              text="Tambah Matkul"
            />
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
                  filteredSubjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      role={Role.ADMIN}
                    />
                  ))
                : subjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      role={Role.ADMIN}
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
                  filteredSubjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      viewType={viewType}
                      role={Role.ADMIN}
                    />
                  ))
                : subjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      viewType={viewType}
                      role={Role.ADMIN}
                    />
                  ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
