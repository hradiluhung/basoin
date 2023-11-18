"use client"
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton"
import PrimaryNavButton from "@/components/buttons/PrimaryNavButton"
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton"
import DropDownFilter from "@/components/dropdownFilter/DropDownFilter"
import ModalAlert from "@/components/modal/ModalAlert"
import ModalForm from "@/components/modal/ModalForm"
import PaketCard from "@/components/cards/PaketCard"
import { WidgetTypes } from "@/constants/widgetTypes"
import { PaketTypes, Semester } from "@/constants/subject"
import { deletePhoto } from "@/helpers/uploadPhotos"
import {
  createPaketBySubjectId,
  deletePaketByPaketId,
  getAllPaketsBySubjectId,
} from "@/controllers/paketsController"
import { deleteSubject, getSubjectById } from "@/controllers/subjectsController"
import { showToast } from "@/helpers/showToast"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeftCircle,
  ArrowUpRight,
  BookOpen,
  Edit,
  Loader,
  PlusCircle,
  Trash2,
  UserCheck,
  X,
} from "react-feather"
import { Paket, Subject } from "@/domain/domain"
import ToggleThemeButton from "@/components/toggleThemeButton/ToggleThemeButton"

function page({ params }: { params: { id: string } }) {
  const { theme } = useTheme()
  const router = useRouter()

  const [subject, setSubject] = useState<Subject>({
    _id: "",
    name: "",
    semester: "",
    code: "",
    image: "",
    publicId: "",
    followers: [],
    numberOfQnA: 0,
    createdAt: undefined,
    updatedAt: undefined,
  })
  const [isDeleteSubjectModalOpen, setIsDeleteSubjectModalOpen] =
    useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeletePaketModalOpen, setIsDeletePaketModalOpen] = useState(false)
  const [isLoadingSubject, setIsLoadingSubject] = useState(true)
  const [isLoadingPakets, setIsLoadingPakets] = useState(true)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [isLoadingAddPaket, setIsLoadingAddPaket] = useState(false)
  const [inputPaket, setInputPaket] = useState<{
    year: string
    paketType: string
  }>({
    year: "",
    paketType: "",
  })
  const [selectedDeletedPaket, setSelectedDeletedPaket] = useState<Paket>({
    _id: "",
    year: 0,
    type: "",
  })
  const [pakets, setPakets] = useState<Paket[]>([])
  const [filteredPakets, setFilteredPakets] = useState<Paket[]>([])
  const [years, setYears] = useState<number[]>([])
  const [filterYear, setFilterYear] = useState("")
  const [filterPaketType, setFilterPaketType] = useState("")
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }

  const fetchSubject = async () => {
    const res = await getSubjectById(params.id)
    setSubject(res.subject)

    setIsLoadingSubject(false)
  }

  const fetchPakets = async () => {
    const res = await getAllPaketsBySubjectId(params.id)
    const years = Array.from(
      new Set(res.pakets.map((paket: Paket) => paket.year))
    ) as number[]

    setPakets(res.pakets)
    setYears(years)
    setIsLoadingPakets(false)
  }

  const fetchAllData = async () => {
    await fetchSubject()
    await fetchPakets()
  }

  const onBackToPreviousScreen = () => {
    router.back()
  }

  const onSubmitAddPaket = async (e: any) => {
    e.preventDefault()

    if (inputPaket.paketType == "" || inputPaket.year == "") {
      showToast(
        "Tahun dan Tipe Paket tidak boleh kosong",
        WidgetTypes.ALERT,
        theme
      )
      return
    }

    if (Number(inputPaket.year) < 0) {
      showToast("Tahun tidak valid", WidgetTypes.ALERT, theme)
      return
    }

    try {
      setIsLoadingAddPaket(true)
      const res = await createPaketBySubjectId(
        params.id,
        Number(inputPaket.year),
        inputPaket.paketType
      )

      if (res.status === 201) {
        showToast(res.message, WidgetTypes.SUCCESS, theme)
        setPakets(
          pakets
            .concat(res.paket)
            .sort((a, b) => (a.type > b.type ? -1 : 1))
            .sort((a, b) => b.year - a.year)
        )
        setYears(years.concat(res.paket.year).sort((a, b) => b - a))
      } else {
        showToast(res.message, WidgetTypes.ALERT, theme)
      }

      setInputPaket({ year: "", paketType: "" })
      setIsFormModalOpen(false)
      setFilterPaketType("")
      setFilterYear("")
      setIsLoadingAddPaket(false)
    } catch (error: any) {
      showToast(error.message, WidgetTypes.ALERT, theme)
      setIsLoadingAddPaket(false)
    }
  }

  const onDeleteSubject = async () => {
    setIsLoadingDelete(true)
    const res = await deleteSubject(params.id)
    await deletePhoto(subject.publicId)

    showToast(res.message, WidgetTypes.SUCCESS, theme)
    setIsDeleteSubjectModalOpen(false)
    setIsLoadingDelete(false)
    router.push("/admin/subject")
  }

  const onDeletePaket = async () => {
    setIsLoadingDelete(true)

    const res = await deletePaketByPaketId(selectedDeletedPaket._id)

    showToast(res.message, WidgetTypes.SUCCESS, theme)
    setIsDeletePaketModalOpen(false)
    setSelectedDeletedPaket({
      _id: "",
      year: 0,
      type: "",
    })
    setIsLoadingDelete(false)
    setPakets(pakets.filter((paket) => paket._id !== selectedDeletedPaket._id))
    setYears(years.filter((year) => year !== selectedDeletedPaket.year))
  }

  const onFilterChange = () => {
    let filteredPakets = pakets
    if (filterYear !== "") {
      filteredPakets = filteredPakets.filter(
        (paket) => paket.year == parseInt(filterYear)
      )
    }

    if (filterPaketType !== "") {
      filteredPakets = filteredPakets.filter(
        (paket) => paket.type == filterPaketType
      )
    }

    setFilteredPakets(filteredPakets)
  }

  const onCloseModalAddPaket = () => {
    setIsFormModalOpen(false)
    setInputPaket({ year: "", paketType: "" })
  }

  const onCloseModalDeletePaket = () => {
    setIsDeletePaketModalOpen(false)
    setSelectedDeletedPaket({
      _id: "",
      year: 0,
      type: "",
    })
  }

  useEffect(() => {
    fetchAllData()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    onFilterChange()
  }, [filterYear, filterPaketType])

  return (
    <>
      <div
        className={`flex w-full left-0 ps-74 sm:ps-4 top-0 z-10 shadow-md justify-between bg-bg-color items-center fixed p-4 ${
          scrollPosition > 0 ? "fixedNavbarOpen" : "fixedNavbarClosed"
        }`}
      >
        {isLoadingSubject ? (
          <div className="h-4 w-36 animate-pulse rounded-md bg-skeleton-color sm:ms-8"></div>
        ) : (
          <div className="font-semibold text-lg sm:ms-8">{subject.name}</div>
        )}
        <ToggleThemeButton />
      </div>
      <main className="flex flex-col h-full px-10 sm:px-4">
        {isDeleteSubjectModalOpen && (
          <ModalAlert
            title="Apakah anda yakin ingin menghapus mata kuliah ini?"
            closeText="Batal"
            primaryText="Hapus"
            closeAction={() => setIsDeleteSubjectModalOpen(false)}
            primaryAction={onDeleteSubject}
            secondaryIcon={X}
            primaryIcon={isLoadingDelete ? Loader : Trash2}
            isLoading={isLoadingDelete}
            primaryTypes={WidgetTypes.ALERT}
          />
        )}

        {isDeletePaketModalOpen && (
          <ModalAlert
            title={`Yakin ingin menghapus paket ${selectedDeletedPaket.year} - ${selectedDeletedPaket.type} ini?`}
            closeText="Batal"
            primaryText="Hapus"
            closeAction={onCloseModalDeletePaket}
            primaryAction={onDeletePaket}
            secondaryIcon={X}
            primaryIcon={isLoadingDelete ? Loader : Trash2}
            isLoading={isLoadingDelete}
            primaryTypes={WidgetTypes.ALERT}
          />
        )}

        {isFormModalOpen && (
          <ModalForm
            inputList={[
              {
                label: "Tahun",
                placeholder: "Tahun",
                value: inputPaket.year,
                type: "number",
                onChange: (e: any) =>
                  setInputPaket({ ...inputPaket, year: e.target.value }),
                required: true,
              },
              {
                label: "Tipe Paket",
                placeholder: "Tipe Paket",
                value: inputPaket.paketType,
                type: "text",
                isDropdown: true,
                dropdownList: Object.values(PaketTypes).sort((a, b) =>
                  a > b ? -1 : 1
                ),
                onChange: (e: any) =>
                  setInputPaket({ ...inputPaket, paketType: e.target.value }),
                required: true,
              },
            ]}
            onCloseModal={onCloseModalAddPaket}
            onSubmit={(e: any) => {
              onSubmitAddPaket(e)
            }}
            isLoading={isLoadingAddPaket}
            title="Tambah Paket"
          />
        )}
        <div className="mb-6 flex justify-between items-center md:flex-col md:items-start sm:flex-col sm:items-start gap-4">
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 items-start">
              <ArrowLeftCircle
                className="w-6 h-6 cursor-pointer mt-2"
                onClick={onBackToPreviousScreen}
              />
              {isLoadingSubject ? (
                <div className="flex flex-col">
                  <div className="h-6 w-40 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-8 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                    <div className="h-4 w-8 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <h1 className="text-2xl font-semibold">{subject.name}</h1>
                    <p className="text-soft-color">
                      <span className="text-soft-color">{subject.code} </span>
                      <span className="text-soft-color">
                        -{" "}
                        {subject.semester === Semester.PILIHAN
                          ? "Matkul"
                          : "Semester"}{" "}
                        {subject.semester}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-4">
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
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <SecondaryActionButton
              ButtonIcon={Trash2}
              text="Hapus"
              onClick={() => setIsDeleteSubjectModalOpen(true)}
              type={WidgetTypes.ALERT}
            />
            <PrimaryNavButton
              ButtonIcon={Edit}
              href={`/admin/subject/${subject._id}/edit`}
              text="Edit"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 mb-4 sm:flex-col">
          <div className="flex flex-start gap-2">
            <DropDownFilter
              label="input-tipe-paket"
              listItem={Object.values(PaketTypes).sort((a, b) =>
                a > b ? -1 : 1
              )}
              value={filterPaketType}
              placeholder="UTS dan UAS"
              setFilter={setFilterPaketType}
            />
            <DropDownFilter
              label="input-tahun"
              listItem={years}
              value={filterYear}
              placeholder="Semua Tahun"
              setFilter={setFilterYear}
            />
          </div>
          <div>
            <PrimaryActionButton
              onClick={() => setIsFormModalOpen(true)}
              ButtonIcon={PlusCircle}
              text="Buat Paket"
            />
          </div>
        </div>

        {/* show loading */}
        {isLoadingPakets && (
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
            <div className="h-24 animate-pulse rounded-lg bg-skeleton-color"></div>
          </div>
        )}

        {/* show emtpy */}
        {!isLoadingPakets && pakets.length === 0 ? (
          <div className="flex-grow bg-card-color rounded-xl shadow-lg flex gap-4 flex-col justify-center items-center">
            <span className="text-soft-color text-center text-lg font-semibold">
              Belum terdapat paket sama sekali
            </span>
            <PrimaryActionButton
              onClick={() => setIsFormModalOpen(true)}
              ButtonIcon={PlusCircle}
              text="Buat Paket"
            />
          </div>
        ) : (
          (filterPaketType !== "" || filterYear !== "") &&
          !isLoadingPakets &&
          filteredPakets.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-soft-color">Paket tidak ditemukan</p>
            </div>
          )
        )}

        {/* show data */}
        {!isLoadingPakets && (
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
            {filterYear !== "" || filterPaketType !== ""
              ? filteredPakets.length > 0 &&
                filteredPakets.map((paket, index) => (
                  <PaketCard
                    key={index}
                    paket={paket}
                    subjectId={params.id}
                    PrimaryIcon={ArrowUpRight}
                    SecondaryIcon={Trash2}
                    secondaryOnClick={() => {
                      setIsDeletePaketModalOpen(true)
                      setSelectedDeletedPaket(paket)
                    }}
                  />
                ))
              : pakets.map((paket, index) => (
                  <PaketCard
                    key={index}
                    paket={paket}
                    subjectId={params.id}
                    PrimaryIcon={ArrowUpRight}
                    SecondaryIcon={Trash2}
                    secondaryOnClick={() => {
                      setIsDeletePaketModalOpen(true)
                      setSelectedDeletedPaket(paket)
                    }}
                  />
                ))}
          </div>
        )}
      </main>
    </>
  )
}

export default page
