import React from "react";
import Image from "next/image";
import { CiLogout } from "react-icons/ci";
import { GiCook } from "react-icons/gi";
import { MdChecklist } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoBookmark } from "react-icons/io5";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import logoNoShadow from "../../../public/images/logo_current_no_shadow.png";
import { NavbarItem } from "./item";
import { ThemeSwitch } from "./theme-switch";

export const Navbar = () => {
  return (
    <Card className="w-full h-full bg-card-background text-foreground flex flex-col items-center p-0 m-0">
      <CardHeader className="flex items-center justify-center">
        <Image src={logoNoShadow} alt="Foodable Logo" width={50} height={50} />
      </CardHeader>

      <CardContent className="flex flex-col items-center flex-grow gap-y-6">
        <NavbarItem Icon={GiCook} text="Recipes" url="/recipe" />
        <NavbarItem
          Icon={MdChecklist}
          text="Grocery List"
          url="/grocery-list"
        />
        <NavbarItem Icon={IoBookmark} text="Saved Items" url="/saved" />
        <NavbarItem Icon={FaUserFriends} text="Social" url="/social" />
        <NavbarItem Icon={IoMdSettings} text="Settings" url="/settings" />
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center gap-y-6">
        <ThemeSwitch />
        <CiLogout size={25} className="font-bold" />
      </CardFooter>
    </Card>
  );
};
