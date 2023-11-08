import { title } from "process";
import React from "react";
import { Icon, Loader } from "react-feather";
import SecondaryActionButton from "../buttons/SecondaryActionButton";
import PrimaryActionButton from "../buttons/PrimaryActionButton";
import { WidgetTypes } from "@/constants/widgetTypes";

type Props = {
  title: string;
  closeText?: string;
  primaryText: string;
  closeAction: () => void;
  primaryAction: () => void;
  primaryIcon?: Icon;
  secondaryIcon?: Icon;
  isLoading?: boolean;
  primaryTypes?: WidgetTypes;
};

export default function ModalAlert({
  title,
  closeText,
  primaryText,
  closeAction,
  primaryAction,
  primaryIcon,
  secondaryIcon,
  isLoading,
  primaryTypes = WidgetTypes.NORMAL,
}: Props) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-card-color rounded-xl p-8 w-96">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <div className="flex gap-2 justify-end">
          <SecondaryActionButton
            ButtonIcon={secondaryIcon}
            onClick={closeAction}
            text={closeText}
          />
          <PrimaryActionButton
            ButtonIcon={isLoading ? Loader : primaryIcon}
            isLoading={isLoading}
            onClick={primaryAction}
            text={primaryText}
            type={primaryTypes}
          />
        </div>
      </div>
    </div>
  );
}
