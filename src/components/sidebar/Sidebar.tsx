"use client"
import React, { useState, useEffect } from "react"
import { Role } from "@/constants/role"
import { adminMenu, userMenu } from "./listNavMenu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, X } from "react-feather"
import { APP_NAME } from "@/constants/appConfig"
import { checkIfMobileSize } from "@/helpers/checkIfMobileSize"

export default function Sidebar({ role }: { role: Role }) {
  const pathName = usePathname()
  const isMobileSize = checkIfMobileSize()
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isMobileSize ? false : true
  )

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const logout = async () => {
    console.log("logout")
  }

  useEffect(() => {
    if (isMobileSize) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobileSize])

  return (
    <>
      <Menu
        className="hidden fixed top-4 left-4 cursor-pointer sm:block"
        onClick={toggleSidebar}
      />
      <aside
        className={`fixed bg-subtle-color w-64 min-h-screen flex flex-col py-4 rounded-md shadow-md z-10 sm:fixed sm:top-0 sm:left-0 
            ${isSidebarOpen ? "sidebarOpen" : "sidebarClosed"}
          `}
      >
        <div className="flex items-center h-14 px-2 justify-center sm:justify-between">
          {<div className="font-semibold text-lg">{APP_NAME}</div>}
          {isMobileSize && (
            <X
              className="absolute right-4 cursor-pointer"
              onClick={toggleSidebar}
            />
          )}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {role === Role.ADMIN
            ? adminMenu.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={isMobileSize ? toggleSidebar : () => {}}
                  className={`flex items-center space-x-2 p-2 rounded-md duration-200 ${
                    pathName === item.href
                      ? "bg-special-bg-color hover:bg-special-bg-color "
                      : "hover:bg-mark-color"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${
                      pathName === item.href && "stroke-white"
                    }`}
                  />
                  <span className={`${pathName === item.href && "text-white"}`}>
                    {item.title}
                  </span>
                </Link>
              ))
            : userMenu.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={isMobileSize ? toggleSidebar : () => {}}
                  className={`flex items-center space-x-2 p-2 rounded-md duration-200 ${
                    pathName === item.href
                      ? "text-white bg-special-bg-color hover:bg-special-bg-color"
                      : "hover:bg-mark-color"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
        </nav>

        <div className="w-full flex items-center justify-center h-14 px-2 py-4">
          <button
            className="w-full flex items-center justify-center space-x-2 border border-border-color p-2 rounded-md duration-200 hover:bg-mark-color"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
