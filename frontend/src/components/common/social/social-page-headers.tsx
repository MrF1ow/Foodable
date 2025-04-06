"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import pfp from "../../../../public/images/pfp.jpg";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user/store";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface SocialPageHeaderProps {
  bannerUrl: string;
}

export const SocialPageHeader = ({ bannerUrl }: SocialPageHeaderProps) => {
  const { user } = useUser();

  return (
    <Card className="relative w-full md:w-full lg:w-full h-full rounded-md overflow-hidden">
      <CardContent>
        <Image
          src={bannerUrl}
          alt="User Banner"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center ">
              <Avatar className="w-20 md:w-25 lg:w-32 h-20 md:h-25 lg:h-32 rounded-full mr-20">
                <AvatarImage
                  src={user?.imageUrl || pfp.src}
                  alt="User Avatar"
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>PFP</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl md:text-7xl lg:text-8xl font-semibold text-green">
                {user?.username}
              </h1>
            </div>
            <FaHeart style={{ fontSize: "60px", color: "red" }} />
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
