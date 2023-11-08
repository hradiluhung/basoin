import { WidgetTypes } from "@/constants/widgetTypes";
import Link from "next/link";
import React from "react";
import { Icon } from "react-feather";

type Props = {
  href: string;
  text?: string;
  ButtonIcon?: Icon;
  type: WidgetTypes;
};

export default function SecondaryNavButton({
  ButtonIcon,
  href,
  text,
  type = WidgetTypes.NORMAL,
}: Props) {
  return (
    <Link
      href={href}
      className={`flex gap-2 items-center px-4 py-2 rounded-xl transition-all border hover:bg-hover-bg-color
        ${type === WidgetTypes.NORMAL && "border-special-color"}
        ${type === WidgetTypes.SUCCESS && "border-success-color"}
        ${type === WidgetTypes.ALERT && "border-alert-color"}
        ${type === WidgetTypes.WARNING && "border-warning-color"}
        ${type === WidgetTypes.INFO && "border-special-color"}
      `}
    >
      {ButtonIcon && (
        <ButtonIcon
          className={`w-5 h-5
            ${type === WidgetTypes.NORMAL && "stroke-special-color"}
            ${type === WidgetTypes.SUCCESS && "stroke-success-color"}
            ${type === WidgetTypes.ALERT && "stroke-alert-color"}
            ${type === WidgetTypes.WARNING && "stroke-warning-color"}
            ${type === WidgetTypes.INFO && "stroke-special-color"}
          `}
        />
      )}
      {text && (
        <span
          className={`
            ${type === WidgetTypes.NORMAL && "text-special-color"}
            ${type === WidgetTypes.SUCCESS && "text-success-color"}
            ${type === WidgetTypes.ALERT && "text-alert-color"}
            ${type === WidgetTypes.WARNING && "text-warning-color"}
            ${type === WidgetTypes.INFO && "text-special-color"}
          `}
        >
          {text}
        </span>
      )}
    </Link>
  );
}
