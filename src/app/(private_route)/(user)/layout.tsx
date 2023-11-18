import Sidebar from "@/components/sidebar/Sidebar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { Role } from "@/constants/role"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen">
      <div className="w-64 sm:w-0">
        <Sidebar role={Role.USER} />
      </div>
      <div className="flex-1 flex min-h-screen flex-col py-16 sm:px-4">
        {children}
      </div>
      <div className="absolute top-4 right-4">
        <ToggleThemeButton />
      </div>
    </main>
  )
}
