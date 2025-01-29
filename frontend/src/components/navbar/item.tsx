import React from "react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

import { useGeneralStore } from "@/stores/general/store";

export const NavbarItem = ({
  Icon,
  text,
  url,
  active,
  isMobile,
}: {
  Icon: IconType;
  text: string;
  url: string;
  active: string;
  isMobile: boolean;
}) => {
  const setCurrent = useGeneralStore((state) => state.setCurrentPage);
  const isActive = active === url;

  const buttonClass = `flex items-center justify-center w-full h-full relative group transition p-2 ${
    isActive
      ? "bg-secondary text-primary"
      : "bg-card-background text-foreground hover:bg-secondary"
  } ${isMobile ? "" : "rounded-lg"}`;

  const iconClass = `${
    isMobile ? "w-[70%] h-[70%]" : "md:w-5 md:h-5 lg:w-6 lg:h-6"
  }`;

  return (
    <Link href={url}>
      <button
        className={buttonClass}
        aria-label={text}
        onClick={() => setCurrent(url)}
      >
        <Icon className={iconClass} />
      </button>
    </Link>
  );
};
