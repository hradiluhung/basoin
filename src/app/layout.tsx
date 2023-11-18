import type { Metadata } from "next"
import { Inter } from "next/font/google"
import MyThemeProvider from "../components/providers/ThemeProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"
import { APP_DESC, APP_NAME } from "@/constants/appConfig"
import AuthProvider from "@/components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESC,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastContainer />
          <MyThemeProvider>{children}</MyThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
