"use client";

import React from "react";
import Image from "next/image";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

import {
  userNavOptions,
  userNavOptionsMobile,
} from "@/config/nav-options";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import logoNoShadow from "../../../../public/images/logo_current_no_shadow.png";
import { NavbarItem } from "./item";
import ThemeSwitch from "@/components/theme-switch";
import { useGeneralStore } from "@/stores/general/store";

export const Navbar = () => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const activeItem = useGeneralStore((state) => state.currentPage);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // or a loading skeleton


  if (!isMobile) {
    {
      /* Sidebar */
    }
    return (
      <Card className="w-full h-full bg-card-background text-foreground flex flex-col items-center p-0 m-0">
        <CardHeader className="flex items-center justify-center mb-12">
          <Link href="/">
            <Image
              src={logoNoShadow}
              alt="Foodable Logo"
              className="cursor-pointer w-[50px] h-[50px]"
            />
          </Link>
        </CardHeader>

        <CardContent className="flex flex-col items-center flex-grow gap-y-6">
          {userNavOptions.map(({ name, url, Icon }) => (
            <NavbarItem
              key={name}
              Icon={Icon}
              text={name}
              url={url}
              active={activeItem}
              isMobile={isMobile}
            />
          ))}
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-y-6">
          <ThemeSwitch />
          <SignOutButton>
            <IoIosLogOut size={25} />
          </SignOutButton>
        </CardFooter>
      </Card>
    );
  } else {
    {
      /* Bottom Navbar */
    }
    return (
      <Card className="w-full h-full bg-card-background text-foreground flex items-center justify-center rounded-xl">
        <CardContent className="grid grid-cols-5 w-full h-full p-0 gap-0">
          {userNavOptionsMobile.map(({ name, url, Icon }) => (
            <NavbarItem
              key={name}
              Icon={Icon}
              text={name}
              url={url}
              active={activeItem}
              isMobile={isMobile}
            />
          ))}
        </CardContent>
      </Card>
    );
  }
};
