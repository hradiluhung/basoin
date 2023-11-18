"use client"
import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import SearchBar from "@/components/searchBar/SearchBar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { getAllUsers } from "@/controllers/usersController"
import { User } from "@/domain/domain"
import React, { useEffect, useState } from "react"
import { BookOpen } from "react-feather"

export default function page() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoadingFetchUser, setIsLoadingFetchUser] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [angkatanFilter, setAngkatanFilter] = useState("")
  const [listAngkatan, setListAngkatan] = useState<number[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchUsers = async () => {
    const res = await getAllUsers()

    setUsers(res.users)

    const angkatans = Array.from(
      new Set(res.users.map((user: User) => user.angkatan))
    ) as number[]

    setListAngkatan(angkatans)
    setIsLoadingFetchUser(false)
  }

  const onFilterChange = () => {
    const filtered = users.filter((user) => {
      return (
        user.name
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) &&
        user.angkatan.toString().includes(angkatanFilter)
      )
    })
    setFilteredUsers(filtered)
  }

  useEffect(() => {
    fetchUsers()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [searchQuery, angkatanFilter])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg sm:ms-8">Daftar User</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-4">
        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold">User</h1>
            <p className="text-soft-color">Daftar user terdaftar di Basoin</p>
          </div>
        </div>
        <div className="flex gap-4 justify-between md:flex-col sm:flex-col">
          <div className="flex gap-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Cari nama user"
            />
            <DropDownFilter
              label="Angkatan"
              value={angkatanFilter}
              placeholder="Semua Angkatan"
              listItem={listAngkatan}
              setFilter={setAngkatanFilter}
            />
          </div>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden">
          {/* show loading */}
          {isLoadingFetchUser && (
            <div className="flex flex-col">
              <div className="h-24 animate-pulse bg-skeleton-color"></div>
              <div className="h-24 animate-pulse bg-skeleton-color"></div>
              <div className="h-24 animate-pulse bg-skeleton-color"></div>
            </div>
          )}

          {/* show empty */}
          {!isLoadingFetchUser && (searchQuery !== "" || angkatanFilter !== "")
            ? filteredUsers.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="h-24 rounded-lg bg-card-color flex justify-center items-center">
                    <p className="text-soft-color">Tidak ada user ditemukan</p>
                  </div>
                </div>
              )
            : !isLoadingFetchUser &&
              users.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="h-24 rounded-lg bg-card-color flex justify-center items-center">
                    <p className="text-soft-color">Belum ada user terdaftar</p>
                  </div>
                </div>
              )}

          <div className="flex flex-col">
            {/* show data */}
            {!isLoadingFetchUser &&
            (searchQuery !== "" || angkatanFilter !== "")
              ? filteredUsers.length >= 0 &&
                filteredUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className={`${
                      users.indexOf(user) === users.length - 1
                        ? ""
                        : "border-b-2 border-mark-color"
                    } shadow-md bg-card-color overflow-hidden flex justify-between items-center p-4`}
                  >
                    <div className="flex items-center basis-8/12 sm:flex-col sm:items-start sm:gap-2">
                      <div className="basis-1/12">
                        <span className="text-soft-color text-xl font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col basis-6/12">
                        <h1 className="text-lg font-semibold">{user.name}</h1>
                        <span className="text-soft-color opacity-50">
                          {user.username}
                        </span>
                      </div>
                      <div className="flex flex-col basis-3/12 opacity-50">
                        <h1 className="text-sm">Angkatan {user.angkatan}</h1>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 opacity-50">
                          <BookOpen className="w-3 h-3 stroke-text-color" />
                          <span className="text-soft-color text-sm">
                            {user.followedSubjects.length} Matkul diikuti
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : !isLoadingFetchUser &&
                users.length >= 0 &&
                users.map((user, index) => (
                  <div
                    key={user._id}
                    className={`${
                      users.indexOf(user) === users.length - 1
                        ? ""
                        : "border-b-2 border-mark-color"
                    } shadow-md bg-card-color overflow-hidden flex justify-between items-center p-4`}
                  >
                    <div className="flex items-center basis-full sm:flex-col sm:items-start sm:gap-2">
                      <div className="basis-1/12">
                        <span className="text-soft-color text-xl font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col basis-6/12">
                        <h1 className="text-lg font-semibold">{user.name}</h1>
                        <span className="text-soft-color opacity-50">
                          {user.username}
                        </span>
                      </div>
                      <div className="flex flex-col basis-3/12 opacity-50">
                        <h1 className="text-sm">Angkatan {user.angkatan}</h1>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 opacity-50">
                          <BookOpen className="w-3 h-3 stroke-text-color" />
                          <span className="text-soft-color text-sm">
                            {user.followedSubjects.length} Matkul diikuti
                          </span>
                        </div>
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
