"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import pfp from "../../../../public/images/pfp.jpg";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user/store";
import Image from "next/image";
import { JSX } from "react";
import userBanner from "../../../../public/images/user_banner.jpg";

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
      </CardContent>
    </Card>
  );
};

export const SocialPageFollowingHeader = () => {
  const selectedSection = useUserStore((state) => state.selectedUserSection);
  const setSelectedSection = useUserStore(
    (state) => state.setSelectedUserSection
  );

  return (
    <div className="w-full">
      <div className="flex justify-start space-x-6 mb-4">
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
    </div>
  );
};
