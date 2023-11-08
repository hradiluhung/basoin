import React from "react"
import { Icon, Trash } from "react-feather"
import SecondaryNavButton from "../buttons/SecondaryNavButton"
import { WidgetTypes } from "@/constants/widgetTypes"
import TetriaryActionButton from "../buttons/TetriaryActionButton"
import { Paket } from "@/domain/domain"

type Props = {
  paket: Paket
  subjectId: string
  SecondaryIcon: Icon
  PrimaryIcon: Icon
  secondaryOnClick: () => void
}

export default function PaketCard({
  paket,
  subjectId,
  PrimaryIcon,
  SecondaryIcon,
  secondaryOnClick,
}: Props) {
  return (
    <div className="bg-card-color items-center rounded-md shadow-md flex justify-between p-4">
      <div className="flex flex-col">
        <p className="text-soft-color text-lg font-semibold">{paket.year}</p>
        <p className="text-soft-color text-md font-normal">{paket.type}</p>
      </div>
      <div className="flex gap-2 items-center">
        <TetriaryActionButton
          ButtonIcon={SecondaryIcon}
          type={WidgetTypes.ALERT}
          onClick={secondaryOnClick}
        />
        <SecondaryNavButton
          ButtonIcon={PrimaryIcon}
          href={`/admin/subject/${subjectId}/paket/${paket._id.toString()}`}
          type={WidgetTypes.NORMAL}
        />
      </div>
    </div>
  )
}
