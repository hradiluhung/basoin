"use client"
import Sidebar from "@/components/sidebar/Sidebar"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { Role } from "@/constants/role"
import { checkIfMobileSize } from "@/helpers/checkIfMobileSize"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  const isMobileSize = checkIfMobileSize()

  return (
    <main className="flex min-h-screen">
      <Sidebar role={Role.USER} />
      <div
        className={`flex-1 flex min-h-screen flex-col py-16 ${
          isMobileSize ? "px-4" : "px-10"
        }`}
      >
        {children}
      </div>
      <div className="absolute top-4 right-4">
        <ToggleThemeButton />
      </div>
    </main>
  )
}
