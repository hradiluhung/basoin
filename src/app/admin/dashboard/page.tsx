"use client"

import DashboardCard from "@/components/cards/DashboardCard"
import { getAllSubjects } from "@/controllers/subjectsController"
import { getAllUsers } from "@/controllers/usersController"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Book, User } from "react-feather"

export default function page() {
  const { theme } = useTheme()
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  const [numberOfSubjects, setNumberOfSubjects] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    const res = await getAllUsers()

    setNumberOfUsers(res.users.length)
  }

  const fetchSubjects = async () => {
    const res = await getAllSubjects()

    setNumberOfSubjects(res.subjects.length)
  }

  const fetchAllData = async () => {
    await fetchUsers()
    await fetchSubjects()

    setIsLoading(false)
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <main>
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
      </div>
    </main>
  )
}
