import PrimaryNavButton from "../buttons/PrimaryNavButton"
import { ArrowUpRight, BookOpen, UserCheck } from "react-feather"
import { Semester } from "@/constants/subject"
import { Role } from "@/constants/role"
import FollowButton from "../buttons/FollowButton"
import { Subject, SubjectWithIsFollowed } from "@/domain/domain"
import { ViewType } from "@/constants/viewType"
import Image from "next/image"

type Props = {
  subject: Subject | SubjectWithIsFollowed
  viewType?: ViewType
  role?: Role
  isFollowed?: boolean
  onUpdateFollowedSubjects?: () => void
  isLoading?: boolean
  isFollowButtonHidden?: boolean
}

export default function SubjectCard({
  subject,
  viewType = ViewType.GRID,
  role = Role.USER,
  isFollowed = false,
  onUpdateFollowedSubjects,
  isLoading = false,
  isFollowButtonHidden = false,
}: Props) {
  return (
    <>
      {viewType === ViewType.GRID ? (
        <div
          key={subject._id}
          className="rounded-lg shadow-md bg-card-color flex justify-between items-center flex-col overflow-hidden"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={
              subject.image !== "" ? subject.image : "/placeholder_subject.jpg"
            }
            alt="Gambar Cover"
            className="w-full h-36 object-cover"
          />
          <div className="p-4 flex flex-col w-full">
            <div className="mb-4">
              <h1 className="text-lg font-semibold">{subject.name}</h1>
              <div>
                <span className="text-soft-color">{subject.code} </span>
                <span className="text-soft-color">
                  -{" "}
                  {subject.semester === Semester.PILIHAN
                    ? "Matkul"
                    : "Semester"}{" "}
                  {subject.semester}
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 opacity-50">
                  <UserCheck className="w-3 h-3 stroke-text-color" />
                  <span className="text-soft-color text-sm">
                    {subject.followers.length} Follower
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <BookOpen className="w-3 h-3 stroke-text-color" />
                  <span className="text-soft-color text-sm">
                    {subject.numberOfQnA} Pertanyaan
                  </span>
                </div>
              </div>
              <div>
                {role === Role.ADMIN && (
                  <PrimaryNavButton
                    ButtonIcon={ArrowUpRight}
                    href={`/admin/subject/${subject._id}`}
                    text="Detail"
                  />
                )}
                {role === Role.USER && (
                  <div className="flex gap-2 items-center">
                    {!isFollowButtonHidden && (
                      <FollowButton
                        isFollowed={isFollowed}
                        onClick={onUpdateFollowedSubjects}
                        isLoading={isLoading}
                      />
                    )}

                    <PrimaryNavButton
                      ButtonIcon={ArrowUpRight}
                      href={`/subject/${subject._id}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          key={subject._id}
          className="rounded-lg shadow-md bg-card-color overflow-hidden flex justify-between items-center p-4"
        >
          <div className="flex items-center basis-8/12 sm:flex-col sm:items-start sm:gap-2">
            <div className="flex flex-col basis-1/2">
              <h1 className="text-lg font-semibold">{subject.name}</h1>
              <div>
                <span className="text-soft-color">{subject.code} </span>
                <span className="text-soft-color">
                  -{" "}
                  {subject.semester === Semester.PILIHAN
                    ? "Matkul"
                    : "Semester"}{" "}
                  {subject.semester}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 opacity-50">
                <UserCheck className="w-3 h-3 stroke-text-color" />
                <span className="text-soft-color text-sm">
                  {subject.followers.length} Follower
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <BookOpen className="w-3 h-3 stroke-text-color" />
                <span className="text-soft-color text-sm">
                  {subject.numberOfQnA} Pertanyaan
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center basis-3/12 justify-end">
            {role === Role.ADMIN && (
              <PrimaryNavButton
                ButtonIcon={ArrowUpRight}
                href={`/admin/subject/${subject._id}`}
                text="Detail"
              />
            )}
            {role === Role.USER && (
              <div className="flex gap-2 items-center">
                <FollowButton
                  isFollowed={isFollowed}
                  onClick={onUpdateFollowedSubjects}
                  isLoading={isLoading}
                />

                <PrimaryNavButton
                  text="Detail"
                  ButtonIcon={ArrowUpRight}
                  href={`/subject/${subject._id}`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
