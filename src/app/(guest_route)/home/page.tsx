"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton"
import ModalForm from "@/components/modal/ModalForm"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"
import { APP_NAME } from "@/constants/appConfig"
import { WidgetTypes } from "@/constants/widgetTypes"
import { signUp } from "@/controllers/usersController"
import { useCheckIfMobileSize } from "@/helpers/checkIfMobileSize"
import { showToast } from "@/helpers/showToast"
import { signIn } from "next-auth/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogIn, Menu, Search, X } from "react-feather"

export default function Page() {
  const { theme } = useTheme()
  const isMobileSize = useCheckIfMobileSize()
  const router = useRouter()

  const [isSignUpModalOpen, setIsSignInModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [inputSignUp, setInputSignUp] = useState({
    username: "",
    name: "",
    angkatan: "",
    password: "",
    confirmPassword: "",
  })
  const [inputLogin, setInputLogin] = useState({ username: "", password: "" })
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const onOpenSignUpModal = () => {
    setIsSignInModalOpen(true)
  }

  const onOpenLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const onCloseSignUpModal = () => {
    setIsSignInModalOpen(false)
    setInputSignUp({
      username: "",
      name: "",
      angkatan: "",
      password: "",
      confirmPassword: "",
    })
  }

  const onCloseLoginModal = () => {
    setIsLoginModalOpen(false)
    setInputLogin({ username: "", password: "" })
  }

  const onSignUpOnClick = async (e: any) => {
    e.preventDefault()
    setIsLoadingSubmit(true)

    if (
      inputSignUp.username === "" ||
      inputSignUp.name === "" ||
      inputSignUp.angkatan === "" ||
      inputSignUp.password === "" ||
      inputSignUp.confirmPassword === ""
    ) {
      showToast("Harap isi semua field", WidgetTypes.ALERT, theme)
      setIsLoadingSubmit(false)
      return
    }

    if (inputSignUp.password !== inputSignUp.confirmPassword) {
      showToast("Password tidak sama", WidgetTypes.ALERT, theme)
      setIsLoadingSubmit(false)
      return
    }

    if (
      inputSignUp.password.length < 8 ||
      inputSignUp.confirmPassword.length < 8
    ) {
      showToast("Password minimal 8 karakter", WidgetTypes.ALERT, theme)
      setIsLoadingSubmit(false)
      return
    }

    try {
      const res = await signUp({
        username: inputSignUp.username,
        name: inputSignUp.name,
        angkatan: Number(inputSignUp.angkatan),
        password: inputSignUp.password,
      })

      if (res.status === 201) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        onCloseSignUpModal()
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    }

    setIsLoadingSubmit(false)
  }

  const onLoginOnClick = async (e: any) => {
    e.preventDefault()
    setIsLoadingSubmit(true)

    const res = await signIn("credentials", {
      username: inputLogin.username,
      password: inputLogin.password,
      redirect: false,
    })

    if (res?.error) {
      setIsLoadingSubmit(false)
      return showToast(res.error, WidgetTypes.ALERT, theme)
    }

    setIsLoadingSubmit(false)
    router.push("/")
  }

  const onToggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen)
  }

  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <main className="w-screen h-screen flex flex-col">
      <div
        className={`flex top-0 z-10 shadow-sm justify-between bg-bg-color fixed p-4 w-full ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        <div className="font-semibold text-lg">{APP_NAME}</div>
        <div className="flex justify-center items-center">
          <Menu
            className="stroke-text-color cursor-pointer"
            onClick={onToggleSideMenu}
          />
        </div>
      </div>
      {isSignUpModalOpen && (
        <ModalForm
          inputList={[
            {
              label: "Username",
              type: "text",
              value: inputSignUp.username,
              onChange: (e: any) =>
                setInputSignUp({
                  ...inputSignUp,
                  username: e.target.value.toLowerCase(),
                }),
              placeholder: "saeproject",
              required: true,
            },
            {
              label: "Nama",
              type: "text",
              value: inputSignUp.name,
              onChange: (e: any) =>
                setInputSignUp({ ...inputSignUp, name: e.target.value }),
              placeholder: "SAE Project",
              required: true,
            },
            {
              label: "Angkatan",
              type: "number",
              value: inputSignUp.angkatan,
              onChange: (e: any) =>
                setInputSignUp({ ...inputSignUp, angkatan: e.target.value }),
              placeholder: "2020",
              required: true,
            },
            {
              label: "Password",
              type: "password",
              value: inputSignUp.password,
              onChange: (e: any) =>
                setInputSignUp({ ...inputSignUp, password: e.target.value }),
              placeholder: "Masukkan password",
              required: true,
              additionalRequiredText: "Min 8 karakter",
            },
            {
              label: "Konfirmasi Password",
              type: "password",
              value: inputSignUp.confirmPassword,
              onChange: (e: any) =>
                setInputSignUp({
                  ...inputSignUp,
                  confirmPassword: e.target.value,
                }),
              placeholder: "Konfirmasi password",
              required: true,
            },
          ]}
          title="Daftar"
          onCloseModal={onCloseSignUpModal}
          onSubmit={onSignUpOnClick}
          isLoading={isLoadingSubmit}
          submitText="Daftar"
        />
      )}

      {isLoginModalOpen && (
        <ModalForm
          inputList={[
            {
              label: "Username",
              type: "text",
              value: inputLogin.username,
              onChange: (e: any) =>
                setInputLogin({
                  ...inputLogin,
                  username: e.target.value.toLowerCase(),
                }),
              placeholder: "saeproject",
              required: true,
            },
            {
              label: "Password",
              type: "password",
              value: inputLogin.password,
              onChange: (e: any) =>
                setInputLogin({
                  ...inputLogin,
                  password: e.target.value.toLowerCase(),
                }),
              placeholder: "Masukkan password",
              required: true,
            },
          ]}
          isLoading={isLoadingSubmit}
          onCloseModal={onCloseLoginModal}
          onSubmit={onLoginOnClick}
          title="Login"
          submitText="Login"
        />
      )}

      <div
        className={`top-0 start-0 end-0 bottom-0 z-50 bg-black bg-opacity-50  ${
          isSideMenuOpen ? "fixed" : ""
        }`}
      >
        <div
          className={`fixed top-0 start-0 bottom-0 z-50 w-64 bg-white shadow-lg ${
            isSideMenuOpen ? "sidebarOpen" : "sidebarClosed"
          }`}
        >
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-end">
              <X
                className="stroke-text-color cursor-pointer"
                onClick={onToggleSideMenu}
              />
            </div>
            <div className="flex flex-col gap-2">
              <SecondaryActionButton
                text="Daftar"
                onClick={() => {
                  onOpenSignUpModal()
                  setIsSideMenuOpen(false)
                }}
              />
              <PrimaryActionButton
                text="Login"
                onClick={() => {
                  onOpenLoginModal()
                  setIsSideMenuOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-center p-4">
        <div className="font-semibold text-lg">{APP_NAME}</div>
        {isMobileSize ? (
          <div className="flex justify-center items-center">
            <Menu
              className="stroke-text-color cursor-pointer"
              onClick={onToggleSideMenu}
            />
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <ToggleThemeButton />
            <SecondaryActionButton text="Daftar" onClick={onOpenSignUpModal} />
            <PrimaryActionButton
              ButtonIcon={LogIn}
              text="Login"
              onClick={onOpenLoginModal}
            />
          </div>
        )}
      </div>

      <div className="flex flex-grow items-center sm:items-start">
        <div className="flex mx-auto py-24 w-4/5 sm:flex-col md:py-12 sm:w-full sm:px-6 sm:py-12">
          <div className="w-1/2 flex flex-col gap-6 justify-start sm:w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold">Bank Soal Informatika</h1>
              <p className="text-lg">
                Siap Ujian? Dapatkan soal dan jawaban terkini di sini!
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <PrimaryActionButton
                text="Cari Bank Soal"
                ButtonIcon={Search}
                onClick={() => {
                  setIsLoginModalOpen(true)
                }}
              />
              <SecondaryActionButton
                text="Daftar"
                onClick={onOpenSignUpModal}
              />
            </div>
            <div className="z-10">
              <p className="text-xs text-soft-color">Dikembangkan oleh</p>
              <h1 className="text-2xl font-semibold">SAE Project</h1>
            </div>
          </div>

          <div className="w-1/2 flex justify-center items-start relative sm:w-full">
            <div className="w-36 h-36 -z-10 top-0 start-0 end-0 bottom-0 m-auto absolute rounded-full bg-yellow-300 animate-rotate-clockwise opacity-50 blur-xl"></div>
            <div className="w-52 h-52 -z-10 top-0 start-0 end-0 bottom-0 m-auto absolute rounded-full bg-blue-500 animate-rotate-anticlockwise opacity-50 blur-xl"></div>

            <Image
              src="/home_image.png"
              alt="home_image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-80 animate-up-down"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
