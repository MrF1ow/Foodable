"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

import { userNavOptions, userNavOptionsMobile } from "@/config/nav-options";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import logoNoShadow from "../../public/images/logo_current_no_shadow.png";
import ThemeSwitch from "@/components/ThemeSwitch";
import { useGeneralStore } from "@/stores/general/store";
import { IconType } from "react-icons/lib";

export default function Navbar(): JSX.Element {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const activeItem = useGeneralStore((state) => state.currentPage);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <></>; // or a loading skeleton

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
              className="cursor-pointer aspect-square h-auto w-12 md:w-16 lg:w-24"
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
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="w-[90vw] max-w-md h-16 bg-card-background text-foreground flex items-center justify-between px-4 shadow-xl rounded-full border">
          <CardContent className="flex items-center justify-between w-full h-full p-0">
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
      </div>
    );
  }
}

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
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const resetForm = useGeneralStore((state) => state.resetCurrentForm);
  const isActive = active === url;

  const buttonClass = `flex items-center justify-center w-12 h-12 relative group transition-all duration-150 ease-in-out rounded-full ${
    isActive
      ? "bg-secondary text-primary"
      : "bg-card-background text-foreground hover:bg-secondary/80"
  }`;

  const iconClass = `${
    isMobile ? "w-[70%] h-[70%]" : "md:w-5 md:h-5 lg:w-6 lg:h-6"
  }`;

  const handleNavClick = () => {
    setCurrent(url);
    setSplitLayout(false);
    resetForm();
  };

  return (
    <Link href={url}>
      <button
        className={buttonClass}
        aria-label={text}
        onClick={handleNavClick}
      >
        <Icon className={iconClass} />
      </button>
    </Link>
  );
};
