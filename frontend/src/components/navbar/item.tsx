import React from "react";
import { IconType } from "react-icons/lib";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const NavbarItem = ({
  Icon,
  text,
  url,
}: {
  Icon: IconType;
  text: string;
  url: string;
}) => {
  return (
    <Link href={url}>
      <button
        className="flex items-center justify-center relative group p-2 rounded-lg bg-card-background hover:bg-secondary text-foreground transition"
        aria-label={text}
      >
        <Icon size={25} />
      </button>
    </Link>
  );
};
