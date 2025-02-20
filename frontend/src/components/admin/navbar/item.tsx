import React from "react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

export const NavbarItem = ({
  Icon,
  text,
  url,
}: {
  Icon: IconType;
  text: string;
  url: string;
}) => {
  const buttonClass = `flex items-center justify-center w-full h-full relative group transition p-2 bg-secondary text-primary`;

  const iconClass = `md:w-5 md:h-5 lg:w-6 lg:h-6`;

  return (
    <Link href={url}>
      <button className={buttonClass} aria-label={text}>
        <Icon className={iconClass} />
      </button>
    </Link>
  );
};
