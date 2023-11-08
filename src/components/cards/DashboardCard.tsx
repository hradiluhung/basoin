import Link from "next/link";
import React from "react";
import { Icon } from "react-feather";
import PrimaryNavButton from "../buttons/PrimaryNavButton";

type Props = {
  CardIcon: Icon;
  isLoading: boolean;
  count: number;
  title: string;
  description: string;
  href: string;
  buttonText: string;
};

export default function DashboardCard({
  CardIcon,
  isLoading,
  count,
  title,
  description,
  buttonText,
  href,
}: Props) {
  return (
    <div className="flex flex-col p-4 bg-card-color rounded-xl shadow-md basis-1/3 lg:basis-1/2 md:basis-full">
      <CardIcon className="w-6 h-6 mb-6" />

      {isLoading ? (
        <>
          <div className="h-6 w-1/3 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-skeleton-color mb-2"></div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold flex items-center">
            {count} {title}
          </h1>
          <p className="text-soft-color mb-4">{description}</p>
        </>
      )}
      <div className="flex justify-start mt-auto">
        <PrimaryNavButton href={href} text={buttonText} />
      </div>
    </div>
  );
}
