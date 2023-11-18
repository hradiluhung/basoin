"use client"

import DashboardCard from "@/components/cards/DashboardCard"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { getAllFeedbacks } from "@/controllers/feedbacksController"
import { getAllSubjects } from "@/controllers/subjectsController"
import { getAllUsers } from "@/controllers/usersController"
import { useEffect, useState } from "react"
import { Book, Send, User } from "react-feather"

export default function page() {
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  const [numberOfSubjects, setNumberOfSubjects] = useState(0)
  const [numberOfFeedbacks, setNumberOfFeedbacks] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchUsers = async () => {
    const res = await getAllUsers()

    setNumberOfUsers(res.users.length)
  }

  const fetchSubjects = async () => {
    const res = await getAllSubjects()

    setNumberOfSubjects(res.subjects.length)
  }

  const fetchFeedbacks = async () => {
    const res = await getAllFeedbacks()

    setNumberOfFeedbacks(res.feedbacks.length)
  }

  const fetchAllData = async () => {
    await fetchUsers()
    await fetchSubjects()
    await fetchFeedbacks()

    setIsLoading(false)
  }

  useEffect(() => {
    fetchAllData()
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
        <div className="font-semibold text-lg sm:ms-8">Dashboard Admin</div>
        <ToggleThemeButton />
      </div>
      <main className="px-10 sm:px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <p className="text-soft-color">Selamat datang kembali!</p>
        </div>
        <div className="flex items-stretch gap-4 min-h-44 md:flex-col sm:flex-col">
          <DashboardCard
            isLoading={isLoading}
            count={numberOfSubjects}
            title="Mata Kuliah"
            description="Mata kuliah yang tersedia bank soalnya"
            href="/admin/subject"
            CardIcon={Book}
            buttonText="Kelola"
          />
          <DashboardCard
            isLoading={isLoading}
            count={numberOfUsers}
            title="User Terdaftar"
            description="User yang terdaftar di aplikasi ini"
            href="/admin/users"
            CardIcon={User}
            buttonText="Kelola"
          />
          <DashboardCard
            isLoading={isLoading}
            count={numberOfFeedbacks}
            title="Feedback"
            description="Feedback dari user"
            href="/admin/feedbacks"
            CardIcon={Send}
            buttonText="Lihat"
          />
        </div>
      </main>
    </>
  )
}
