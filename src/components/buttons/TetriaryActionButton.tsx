import { WidgetTypes } from "@/constants/widgetTypes";
import React from "react";
import { Icon } from "react-feather";

type Props = {
  text?: string;
  ButtonIcon?: Icon;
  onClick?: () => void;
  type?: WidgetTypes;
};

export default function TetriaryActionButton({
  ButtonIcon,
  text,
  onClick,
  type = WidgetTypes.NORMAL,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-hover-bg-color"
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
    </button>
  );
}