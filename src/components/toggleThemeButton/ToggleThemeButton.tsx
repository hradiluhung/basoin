"use client"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Moon, Sun } from "react-feather"

export default function ToggleThemeButton() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      className="flex justify-center items-center w-10 h-10 bg-card-color rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-border-color"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  )
}
