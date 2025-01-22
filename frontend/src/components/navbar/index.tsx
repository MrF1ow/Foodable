import React from "react";
import Image from "next/image";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";

import { navOptions } from "@/config/nav-options";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import logoNoShadow from "../../../public/images/logo_current_no_shadow.png";
import { NavbarItem } from "./item";
import ThemeSwitch from "../theme-switch";

export const Navbar = () => {
  return (
    <Card className="w-full h-full bg-card-background text-foreground flex flex-col items-center p-0 m-0">
      <CardHeader className="flex items-center justify-center mb-12">
        <Link href="/">
          <Image
            src={logoNoShadow}
            alt="Foodable Logo"
            width={50}
            height={50}
          />
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col items-center flex-grow gap-y-6">
        {navOptions.map(({ name, url, Icon }) => (
          <NavbarItem key={name} Icon={Icon} text={name} url={url} />
        ))}
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center gap-y-6">
        <ThemeSwitch />
        <CiLogout size={25} className="font-bold" />
      </CardFooter>
    </Card>
  );
};
