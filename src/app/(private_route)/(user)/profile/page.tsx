"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { User } from "@/domain/domain"
import { getUserById } from "@/controllers/usersController"
import { Edit } from "react-feather"
import TetriaryActionButton from "@/components/buttons/TetriaryActionButton"
import { useRouter } from "next/navigation"
import Image from 'next/image'

export default function Page() {
  const { data } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    name: "",
    angkatan: 0,
    followedSubjects: [],
    createdAt: undefined,
    updatedAt: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    if (data?.user?.id) {
      const res = await getUserById(data?.user?.id)
      setUser(res.user)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [data])

  return (
    <main className="px-10 sm:px-2">
      <div className="mb-6 flex justify-start items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Profil</h1>
          <p className="text-soft-color">Data diri Anda</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-1/2 lg:w-full md:w-full sm:w-full">
        {/* show loading */}
        {isLoading && (
          <>
            <div className="w-full h-64 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="flex gap-4">
              <div className="w-full h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
              <div className="w-full h-48 animate-pulse rounded-lg bg-skeleton-color"></div>
            </div>
          </>
        )}

        {/* show data */}
        {!isLoading && (
          <>
            <div className="w-full h-48 rounded-lg bg-card-color relative p-4">
              <div className="flex flex-col justify-center items-center h-full">
                <Image
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundType=gradientLinear`}
                  alt="avatar"
                  className="w-24 h-24 rounded-full"
                />
                <h1 className="text-2xl font-semibold text-center">
                  {user.name}
                </h1>
                <p className="text-soft-color text-center">{user.username}</p>
              </div>

              <div className="absolute top-2 right-2">
                <TetriaryActionButton
                  ButtonIcon={Edit}
                  onClick={() => {
                    router.push("/profile/edit")
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full h-48 rounded-lg bg-card-color p-4">
                <div className="flex flex-col justify-center items-center h-full">
                  <h1 className="text-2xl font-semibold text-center">
                    Angkatan {user.angkatan}
                  </h1>
                  {user.createdAt && (
                    <p className="text-soft-color text-center">
                      Bergabung pada{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full h-48 rounded-lg bg-card-color p-4">
                <div className="flex flex-col justify-center items-center h-full">
                  <h1 className="text-2xl font-semibold text-center">
                    {user.followedSubjects.length}
                  </h1>
                  <p className="text-soft-color text-center">
                    Mata Kuliah Diikuti
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
