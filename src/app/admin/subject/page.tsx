"use client"

import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import PrimaryNavButton from "@/components/buttons/PrimaryNavButton"
import SearchBar from "@/components/searchBar/SearchBar"
import SubjectCardAdmin from "@/components/cards/SubjectCardAdmin"
import { getAllSubjects } from "@/controllers/subjectsController"
import React, { useEffect, useState } from "react"
import { Grid, List, PlusCircle } from "react-feather"
import { Semester } from "@/constants/subject"
import { Subject } from "@/domain/domain"

export enum ViewType {
  LIST = "list",
  GRID = "grid",
}

export default function page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [semesterFilter, setSemesterFilter] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [viewType, setViewType] = useState<ViewType>(ViewType.GRID)

  const fetchSubjects = async () => {
    const res = await getAllSubjects()

    setSubjects(res.subjects)

    setIsLoading(false)
  }

  const onFilterChange = () => {
    const filtered = subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [searchQuery, semesterFilter])

  return (
    <main>
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
                  <p className="text-soft-color">Mata kuliah tidak ditemukan</p>
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
                  <SubjectCardAdmin key={subject._id} subject={subject} />
                ))
              : subjects.map((subject) => (
                  <SubjectCardAdmin key={subject._id} subject={subject} />
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
                  <p className="text-soft-color">Mata kuliah tidak ditemukan</p>
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
                  <SubjectCardAdmin
                    key={subject._id}
                    subject={subject}
                    viewType={viewType}
                  />
                ))
              : subjects.map((subject) => (
                  <SubjectCardAdmin
                    key={subject._id}
                    subject={subject}
                    viewType={viewType}
                  />
                ))}
          </div>
        </div>
      )}
    </main>
  )
}
