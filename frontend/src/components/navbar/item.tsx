import React from "react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

import { useGeneralStore } from "@/stores/general/store";

export const NavbarItem = ({
  Icon,
  text,
  url,
  isMobile,
  active,
}: {
  Icon: IconType;
  text: string;
  url: string;
  isMobile: boolean;
  active: string;
}) => {
  const setCurrent = useGeneralStore((state) => state.setCurrentPage);
  const isActive = active === text;

  const buttonClass = `flex items-center justify-center relative group p-2 rounded-lg transition ${
    isActive
      ? "bg-card-secondary text-primary"
      : "bg-card-background text-foreground hover:bg-secondary"
  }`;

  if (!isMobile) {
    return (
      <Link href={url}>
        <button
          className={buttonClass}
          aria-label={text}
          onClick={() => setCurrent(text)}
        >
          <Icon size={25} />
        </button>
      </Link>
    );
  } else {
    return (
      <Link href={url}>
        <button
          className={buttonClass}
          aria-label={text}
          onClick={() => setCurrent(text)}
        >
          <Icon size={25} />
        </button>
      </Link>
    );
  }
};
