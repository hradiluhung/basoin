import { WidgetTypes } from "@/constants/widgetTypes";
import React from "react";
import { Icon } from "react-feather";

type Props = {
  text?: string;
  ButtonIcon?: Icon;
  onClick?: () => void;
  isLoading?: boolean;
  type?: WidgetTypes;
  isSubmit?: boolean;
};

export default function PrimaryActionButton({
  ButtonIcon,
  text,
  onClick,
  isLoading,
  type = WidgetTypes.NORMAL,
  isSubmit = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      type={isSubmit ? "submit" : "button"}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
        ${
          type === WidgetTypes.NORMAL &&
          "bg-special-bg-color hover:bg-special-color"
        }
        ${
          type === WidgetTypes.SUCCESS &&
          "bg-success-bg-color hover:bg-success-color"
        }

        ${
          type === WidgetTypes.ALERT && "bg-alert-bg-color hover:bg-alert-color"
        }

        ${
          type === WidgetTypes.WARNING &&
          "bg-warning-bg-color hover:bg-warning-color"
        }

        ${
          type === WidgetTypes.INFO &&
          "bg-special-bg-color hover:bg-special-bg-color"
        }
        }
      `}
    >
      {ButtonIcon && (
        <ButtonIcon
          className={`w-5 h-5 stroke-white ${isLoading && "animate-spin"}`}
        />
      )}
      <span className="text-white">{text}</span>
    </button>
  );
}
