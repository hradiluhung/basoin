"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton"
import TetriaryActionButton from "@/components/buttons/TetriaryActionButton"
import InputField from "@/components/inputField/InputField"
import { WidgetTypes } from "@/constants/widgetTypes"
import { getUserById, updateUserById } from "@/controllers/usersController"
import { User } from "@/domain/domain"
import { showToast } from "@/helpers/showToast"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeftCircle, Check, Key, Loader } from "react-feather"

export default function page() {
  const { data } = useSession()
  const router = useRouter()
  const { theme } = useTheme()

  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    name: "",
    angkatan: 0,
    followedSubjects: [],
    createdAt: undefined,
    updatedAt: undefined,
  })
  const [oldUser, setOldUser] = useState<User>({
    _id: "",
    username: "",
    name: "",
    angkatan: 0,
    followedSubjects: [],
    createdAt: undefined,
    updatedAt: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const fetchUser = async () => {
    if (data?.user?.id) {
      const res = await getUserById(data?.user?.id)
      setUser(res.user)
      setOldUser(res.user)
      setIsLoading(false)
    }
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const onSubmit = async () => {
    try {
      setIsLoadingSubmit(true)
      const res = await updateUserById({
        id: user._id,
        username: user.username,
        name: user.name,
        angkatan: user.angkatan,
      })

      if (res.status === 200) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        onBackToPreviousScreen()
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  const resetUser = () => {
    setUser(oldUser)
  }

  useEffect(() => {
    fetchUser()
  }, [data])

  return (
    <main className="flex flex-col h-full px-10 sm:px-2">
      <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
        <div className="flex flex-col justify-start">
          <div className="flex gap-2 items-center">
            <ArrowLeftCircle
              className="w-6 h-6 cursor-pointer"
              onClick={onBackToPreviousScreen}
            />
            <h1 className="text-2xl font-semibold">Edit Profil</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-2/5 lg:w-4/5 md:w-full sm:w-full">
        {/* show loading */}
        {isLoading && (
          <div className="w-full h-96 animate-pulse rounded-lg bg-skeleton-color"></div>
        )}

        {/* show data */}
        {!isLoading && (
          <div className="bg-card-color p-6 rounded-lg flex flex-col gap-4">
            <InputField
              label="Username"
              value={user.username}
              id="username"
              name="username"
              onChange={(e) => {
                setUser({ ...user, username: e.target.value })
              }}
              placeholder="Username"
              required={true}
              type="text"
            />
            <InputField
              label="Nama"
              value={user.name}
              id="Nama"
              name="Nama"
              onChange={(e) => {
                setUser({ ...user, name: e.target.value })
              }}
              placeholder="Nama"
              required={true}
              type="text"
            />
            <InputField
              label="Angkatan"
              type="number"
              value={user.angkatan.toString()}
              onChange={(e: any) =>
                setUser({ ...user, angkatan: e.target.value })
              }
              placeholder="2020"
              required={true}
              id="angkatan"
              name="angkatan"
            />
            <div className="flex gap-2 w-full flex-wrap justify-between mt-6 sm:flex-col sm:items-start">
              <TetriaryActionButton
                text="Ganti Password"
                ButtonIcon={Key}
                onClick={() => {
                  router.push("/profile/edit/password")
                }}
              />
              <div className="flex gap-2 justify-end sm:w-full">
                <SecondaryActionButton
                  text="Reset"
                  onClick={() => {
                    resetUser()
                  }}
                />
                <PrimaryActionButton
                  isLoading={isLoadingSubmit}
                  ButtonIcon={isLoadingSubmit ? Loader : Check}
                  text="Simpan"
                  onClick={onSubmit}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
