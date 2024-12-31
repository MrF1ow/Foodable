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
      <Button
        variant="ghost"
        className="flex items-center justify-center relative group"
      >
        <Icon width={16} height={16} />
        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
          {text}
        </span>
      </Button>
    </Link>
  );
};
