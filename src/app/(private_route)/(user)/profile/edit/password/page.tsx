"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import InputField from "@/components/inputField/InputField"
import { WidgetTypes } from "@/constants/widgetTypes"
import { updatePasswordById } from "@/controllers/usersController"
import { showToast } from "@/helpers/showToast"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeftCircle, Check, Loader } from "react-feather"

export default function page() {
  const { data } = useSession()
  const router = useRouter()
  const { theme } = useTheme()

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const onSubmitPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showToast(
        "Password baru dan konfirmasi password baru tidak sama",
        WidgetTypes.ALERT,
        theme
      )
      return
    }

    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      showToast("Password tidak boleh kosong", WidgetTypes.ALERT, theme)
      return
    }

    if (data?.user?.id) {
      setIsLoadingSubmit(true)
      try {
        const res = await updatePasswordById({
          id: data?.user?.id,
          oldPassword,
          newPassword,
        })

        if (res.status === 200) {
          showToast(res.message, WidgetTypes.SUCCESS, theme)
          router.back()
        } else {
          showToast(res.message, WidgetTypes.ALERT, theme)
        }
      } catch (error: any) {
        showToast(error.message, WidgetTypes.ALERT, theme)
      } finally {
        setIsLoadingSubmit(false)
      }
    }
  }

  return (
    <main className="flex flex-col h-full px-10 sm:px-2">
      <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
        <div className="flex flex-col justify-start">
          <div className="flex gap-2 items-center">
            <ArrowLeftCircle
              className="w-6 h-6 cursor-pointer"
              onClick={onBackToPreviousScreen}
            />
            <h1 className="text-2xl font-semibold">Edit Password</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-2/5 lg:w-4/5 md:w-full sm:w-full">
        <div className="bg-card-color p-6 rounded-lg flex flex-col gap-4">
          <InputField
            label="Password lama"
            value={oldPassword}
            id="old-password"
            name="old-password"
            onChange={(e) => {
              setOldPassword(e.target.value)
            }}
            placeholder="Password lama"
            required={true}
            type="password"
          />
          <InputField
            label="Password Baru"
            value={newPassword}
            id="new-password"
            name="new-password"
            onChange={(e) => {
              setNewPassword(e.target.value)
            }}
            placeholder="Password Baru"
            required={true}
            type="password"
          />
          <InputField
            label="Konfirmasi Password Baru"
            value={confirmNewPassword}
            id="confirm-new-password"
            name="confirm-new-password"
            onChange={(e) => {
              setConfirmNewPassword(e.target.value)
            }}
            placeholder="Konfirmasi Password Baru"
            required={true}
            type="password"
          />

          <div className="flex gap-2 w-full justify-end">
            <PrimaryActionButton
              isLoading={isLoadingSubmit}
              ButtonIcon={isLoadingSubmit ? Loader : Check}
              text="Simpan"
              onClick={onSubmitPassword}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
