import { IconType } from "react-icons/lib";

import { GiCook } from "react-icons/gi";
import { MdChecklist } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoBookmark } from "react-icons/io5";

interface NavOption {
  name: string;
  url: string;
  Icon: IconType;
}

export const guestNavOptions: NavOption[] = [
  {
    name: "Recipes",
    url: "/recipe",
    Icon: GiCook,
  },
  {
    name: "Grocery List",
    url: "/grocery-list",
    Icon: MdChecklist,
  },
  {
    name: "Settings",
    url: "/settings",
    Icon: IoMdSettings,
  },
];

export const adminNavOptions: NavOption[] = [
  {
    name: "Recipes",
    url: "/recipe",
    Icon: GiCook,
  },
  {
    name: "Grocery List",
    url: "/grocery-list",
    Icon: MdChecklist,
  },
  {
    name: "Saved Items",
    url: "/saved",
    Icon: IoBookmark,
  },
  {
    name: "Social",
    url: "/social",
    Icon: FaUserFriends,
  },
  {
    name: "Settings",
    url: "/settings",
    Icon: IoMdSettings,
  },
];

export const userNavOptions: NavOption[] = [
  {
    name: "Recipes",
    url: "/recipe",
    Icon: GiCook,
  },
  {
    name: "Grocery List",
    url: "/grocery-list",
    Icon: MdChecklist,
  },
  {
    name: "Saved Items",
    url: "/saved",
    Icon: IoBookmark,
  },
  {
    name: "Social",
    url: "/social",
    Icon: FaUserFriends,
  },
  {
    name: "Settings",
    url: "/settings",
    Icon: IoMdSettings,
  },
];

export const userNavOptionsMobile: NavOption[] = [
  {
    name: "Saved Items",
    url: "/saved",
    Icon: IoBookmark,
  },
  {
    name: "Grocery List",
    url: "/grocery-list",
    Icon: MdChecklist,
  },
  {
    name: "Recipes",
    url: "/recipe",
    Icon: GiCook,
  },
  {
    name: "Social",
    url: "/social",
    Icon: FaUserFriends,
  },
  {
    name: "Settings",
    url: "/settings",
    Icon: IoMdSettings,
  },
];
