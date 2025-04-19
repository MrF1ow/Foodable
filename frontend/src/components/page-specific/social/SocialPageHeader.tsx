"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import pfp from "../../../../public/images/pfp.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JSX } from "react";
import userBanner from "../../../../public/images/user_banner.jpg";
import { MdEdit } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { useGeneralStore } from "@/stores/general/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useSocialStore } from "@/stores/social/store";


export default function SocialPageHeader({ userDetails }: { userDetails: any }): JSX.Element {

  const { userName, userPfp } = userDetails;

  return (
    <Card className="relative w-full h-full rounded-md overflow-hidden">
      <CardContent>
        <Image
          src={userBanner}
          alt="User Banner"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-4">
              <Avatar className="aspect-square w-16 h-auto md:w-24 lg:w-32 rounded-full">
                <AvatarImage
                  src={userPfp || pfp.src}
                  alt="User Avatar"
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>PFP</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold">
                {userName}
              </h1>
            </div>
            <FaHeart className="aspect-square w-10 h-auto md:w-12 lg:w-16 text-red-500" />
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <MdEdit className="aspect-square w-10 h-auto pr-2 pt-2 shadow-lg hover:scale-105" />
        </div>
      </CardContent>
    </Card>
  );
};

export const SocialPageSavedHeader = () => {
  const selectedSection = useSocialStore((state) => state.currentSavedSection);
  const setSelectedSection = useSocialStore(
    (state) => state.setCurrentSavedSection
  );
  const setSearchQuery = useSocialStore((state) => state.setSavedItemsQuery);
  const currentSearchQuery = useSocialStore((state) => state.savedItemsQuery);
  const isMobile = useGeneralStore((state) => state.isMobile);

  return (
    <div className="w-full flex gap-2 lg:justify-between items-center">
      <SearchBar
        searchQuery={currentSearchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="!h-10 !w-12 bg-card-background"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedSection("recipes")}>
              Recipes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedSection("groceryLists")}>
              Grocery Lists
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <div className="flex gap-2 items-center">
          <Button
            variant={selectedSection === "recipes" ? "default" : "outline"}
            className={`text-1xl md:text-2xl lg:text-2xl font-semibold ${selectedSection === "recipes"
              ? "bg-primary text-foreground"
              : "text-primary border-2 border-primary"
              } px-6 py-2 rounded-md`}
            onClick={() => setSelectedSection("recipes")}
          >
            Recipes
          </Button>
          <Button
            variant={selectedSection === "groceryLists" ? "default" : "outline"}
            className={`text-1xl md:text-2xl lg:text-2xl font-semibold ${selectedSection === "groceryLists"
              ? "bg-primary text-foreground"
              : "text-primary border-2 border-primary"
              } px-6 py-2 rounded-md`}
            onClick={() => setSelectedSection("groceryLists")}
          >
            Lists
          </Button>
        </div>
      )
      }
    </div>

  );
};


export const SocialPageFollowingHeader = () => {
  const selectedSection = useSocialStore((state) => state.currentFollowSection);
  const setSelectedSection = useSocialStore(
    (state) => state.setCurrentFollowSection
  );
  const setSearchQuery = useSocialStore((state) => state.setUserQuery);
  const currentSearchQuery = useSocialStore((state) => state.userQuery);
  const isMobile = useGeneralStore((state) => state.isMobile);

  return (
    <div className="w-full flex gap-2 lg:justify-between items-center">
      <SearchBar
        searchQuery={currentSearchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="!h-10 !w-12 bg-card-background"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedSection("following")}>
              Following
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedSection("followers")}>
              Followers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <div className="flex gap-2 items-center">
          <Button
            variant={selectedSection === "followers" ? "default" : "outline"}
            className={`text-1xl md:text-2xl lg:text-2xl font-semibold ${selectedSection === "followers"
              ? "bg-primary text-foreground"
              : "text-primary border-2 border-primary"
              } px-6 py-2 rounded-md`}
            onClick={() => setSelectedSection("followers")}
          >
            Followers
          </Button>
          <Button
            variant={selectedSection === "following" ? "default" : "outline"}
            className={`text-1xl md:text-2xl lg:text-2xl font-semibold ${selectedSection === "following"
              ? "bg-primary text-foreground"
              : "text-primary border-2 border-primary"
              } px-6 py-2 rounded-md`}
            onClick={() => setSelectedSection("following")}
          >
            Following
          </Button>
        </div>
      )
      }
    </div>

  );
};
