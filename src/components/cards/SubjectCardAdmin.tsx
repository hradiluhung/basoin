import React from "react";
import PrimaryNavButton from "../buttons/PrimaryNavButton";
import { ArrowUpRight, BookOpen, UserCheck } from "react-feather";
import { ViewType } from "@/app/admin/subject/page";
import { Semester } from "@/constants/subject";

type Props = {
  subject: any;
  viewType?: ViewType;
};

export default function SubjectCardAdmin({
  subject,
  viewType = ViewType.GRID,
}: Props) {
  return (
    <>
      {viewType === ViewType.GRID ? (
        <div
          key={subject._id}
          className="rounded-lg shadow-md bg-card-color flex justify-between items-center flex-col overflow-hidden"
        >
          <img
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
                <PrimaryNavButton
                  ButtonIcon={ArrowUpRight}
                  href={`/admin/subject/${subject._id}`}
                  text="Detail"
                />
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
            <PrimaryNavButton
              ButtonIcon={ArrowUpRight}
              href={`/admin/subject/${subject._id}`}
              text="Detail"
            />
          </div>
        </div>
      )}
    </>
  );
}
