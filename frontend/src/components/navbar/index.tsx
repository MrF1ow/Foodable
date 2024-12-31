import React from "react";
import Image from "next/image";
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

export const Navbar = () => {
  return (
    <Card className="w-full sm:w-96 bg-card-background text-foreground h-full flex flex-col items-center">
      <CardHeader>
        <Image src={logoNoShadow} alt="Foodable Logo" width={20} height={20} />
      </CardHeader>
      <CardContent>
        <NavbarItem Icon={GiCook} text="Recipes" url="/recipes" />
        <NavbarItem
          Icon={MdChecklist}
          text="Grocery List"
          url="/grocery-list"
        />
        <NavbarItem Icon={IoBookmark} text="Saved Items" url="/saved" />
        <NavbarItem Icon={FaUserFriends} text="Social" url="/social" />
        <NavbarItem Icon={IoMdSettings} text="Settings" url="/settings" />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
