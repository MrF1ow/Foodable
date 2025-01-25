import React from "react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

import { useGeneralStore } from "@/stores/general/store";

export const NavbarItem = ({
  Icon,
  text,
  url,
  active,
}: {
  Icon: IconType;
  text: string;
  url: string;
  active: string;
}) => {
  const setCurrent = useGeneralStore((state) => state.setCurrentPage);
  const isActive = active === url;

  const buttonClass = `flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 relative group p-2 rounded-lg transition ${
    isActive
      ? "bg-secondary text-primary"
      : "bg-card-background text-foreground hover:bg-secondary"
  }`;

  return (
    <Link href={url}>
      <button
        className={buttonClass}
        aria-label={text}
        onClick={() => setCurrent(url)}
      >
        <Icon size={20} className="flex-shrink-0" />
      </button>
    </Link>
  );
};
