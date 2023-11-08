import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "./providers"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"
import { APP_DESC, APP_NAME } from "@/constants/appConfig"

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
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
