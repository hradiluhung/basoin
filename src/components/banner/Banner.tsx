"use client"
import Link from "next/link"
import { CheckCircle } from "react-feather"
import Image from "next/image"

type Props = {
  followedSubjectCount: number
}

export default function Banner({ followedSubjectCount }: Props) {
  return (
    <div className="bg-card-gradient shadow-xl w-full rounded-xl p-16 flex justify-between items-center md:flex-col md:p-8 sm:flex-col sm:p-8">
      <div>
        <div>
          <p className="text-slate-200 font-semibold text-lg">Basoin</p>
          <h1 className="text-4xl font-bold text-white">
            Bank Soal Informatika
          </h1>
        </div>
        <div className="flex mt-8 items-center gap-2 sm:flex-col">
          <Link
            href={"/following"}
            className="bg-white rounded-xl px-4 py-2 font-semibold flex gap-2 hover:bg-gray-200 transition-all sm:w-full sm:justify-center"
          >
            <CheckCircle className="stroke-slate-800" />
            <span className="text-slate-800">
              {followedSubjectCount} Matkul Diikuti
            </span>
          </Link>

          <Link
            href="/browse"
            className="flex gap-2 items-center px-4 py-2 rounded-xl transition-all border border-slate-100 hover:bg-slate-100 hover:bg-opacity-20 sm:w-full sm:justify-center"
          >
            <span className="text-slate-100">Cari Mata Kuliah</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center h-32 md:h-auto sm:h-auto">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src="/magnifying-glass.png"
          alt="home_image"
          className="w-80 animate-up-down"
        />
      </div>
    </div>
  )
}
