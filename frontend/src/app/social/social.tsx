"use client";

import * as React from "react";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../public/images/avatar.jpg";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user/store";
import { FaHeart } from "react-icons/fa";

export default function Social() {
  const language = useUserStore((state) => state.language);
  const preferences = useUserStore((state) => state.preferences);

  // Filter followers based on search query
  const filteredFollowers =
    followers?.filter((followerId: any) =>
      followerId.toLowerCase().includes(searchFollowingQuery.toLowerCase())
    ) || [];

  const filteredFollowing =
    following?.filter((followingId: any) =>
      followingId.toLowerCase().includes(searchFollowingQuery.toLowerCase())
    ) || [];

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchRecipesQuery.toLowerCase())
  );

  // Handle deleting a follower
  const handleDeleteFollowers = (followerId: string) => {
    removeFollower(followerId); // Remove from following list
  };
  const handleDeleteFollowing = (followingId: string) => {
    removeFollowing(followingId); // Remove from following list
  };

  const handleLikeRecipe = (id: number) => {
    console.log(`Recipe with ID ${id} liked!`);
  };

  const PageHeader = () => {
    return (
      <Card className="relative w-full h-[30vh] rounded-md overflow-hidden">
        <CardContent className="bg-cover bg-center bg-no-repeat">
          <div className="absolute bottom-0 right-0 cursor-pointer pb-4 pr-4">
            <FaHeart style={{ fontSize: "80px", color: "red" }} />
          </div>

          <div className="absolute bottom-0 left-40 p-6 bg-opacity-50">
            <h1 className="text-8xl font-semibold text-green truncate ml-20">
              {"John Doe"}
            </h1>
          </div>

          <div className="absolute bottom-4 left-4 p-2 bg-white rounded-full">
            <Avatar className="w-32 h-32 rounded-full">
              <AvatarImage
                src={pfp.src}
                alt="User Avatar"
                className="object-cover w-full h-full rounded-full"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeftSideHeader = () => {
    return (
      <div className="flex justify-start space-x-6 mb-4">
        <Button
          variant={isFollowingSelected ? "default" : "outline"}
          className={`text-2xl font-semibold ${
            isFollowingSelected
              ? "bg-green-500 text-white"
              : "text-green-500 border-2 border-green-500"
          } px-6 py-2 rounded-md`}
          onClick={() => setIsFollowingSelected(true)}
        >
          Followers
        </Button>
        <Button
          variant={isFollowingSelected ? "outline" : "default"}
          className={`text-2xl font-semibold ${
            !isFollowingSelected
              ? "bg-green-500 text-white"
              : "text-green-500 border-2 border-green-500"
          } px-6 py-2 rounded-md`}
          onClick={() => setIsFollowingSelected(false)}
        >
          Following
        </Button>
      </div>
    );
  };

  const RightSideHeader = () => (
    <div className="bg-primary text-foreground p-4 rounded-t-md">
      <h2 className="text-xl font-semibold">Recipes</h2>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full gap-y-6 overflow-y-auto">
      <div className="w-full h-[40vh]">
        <PageHeader />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Card: Followers or Following */}
        <Card className="bg-orange-50 overflow-auto">
          <CardContent className="p-6">
            <LeftSideHeader />{" "}
            {/* Add buttons for switching between followers and following */}
            {isFollowingSelected ? (
              <>
                <SearchBar1
                  searchQuery={searchFollowingQuery}
                  setSearchQuery={setSearchFollowingQuery}
                />
                <div className="mt-4">
                  {filteredFollowers?.length === 0 ? (
                    <p>No followers found</p>
                  ) : (
                    filteredFollowers?.map((followerId) => (
                      <div
                        key={followerId.toString()}
                        className="flex items-center bg-white p-4 rounded-md shadow-md mb-4"
                      >
                        <Avatar className="w-10 h-10 mr-4">
                          <AvatarImage
                            src={pfp.src}
                            alt="Follower Avatar"
                            className="object-cover w-full h-full rounded-full"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-lg font-semibold">
                          {followerId.toString()}
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-500 border-2 border-red-500 p-2 rounded-full"
                          onClick={() =>
                            handleDeleteFollowers(followerId.toString())
                          }
                        >
                          <Icons.delete />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <SearchBar1
                  searchQuery={searchFollowingQuery}
                  setSearchQuery={setSearchFollowingQuery}
                />
                <div className="mt-4">
                  {filteredFollowing?.length === 0 ? (
                    <p>No following found</p>
                  ) : (
                    filteredFollowing?.map((followerId) => (
                      <div
                        key={followerId.toString()}
                        className="flex items-center bg-white p-4 rounded-md shadow-md mb-4"
                      >
                        <Avatar className="w-10 h-10 mr-4">
                          <AvatarImage
                            src={pfp.src}
                            alt="Following Avatar"
                            className="object-cover w-full h-full rounded-full"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-lg font-semibold">
                          {followerId.toString()}
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-500 border-2 border-red-500 p-2 rounded-full"
                          onClick={() =>
                            handleDeleteFollowing(followerId.toString())
                          }
                        >
                          <Icons.delete />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Card: Recipe Feed */}
        <Card className="bg-gray-50">
          <CardContent>
            <RightSideHeader />
            <SearchBar2
              searchQuery={searchRecipesQuery}
              setSearchQuery={setSearchRecipesQuery}
            />
            <div className="mt-4">
              {filteredRecipes?.length === 0 ? (
                <p>No recipes found</p>
              ) : (
                filteredRecipes?.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center bg-white p-4 rounded-md shadow-md mb-4"
                  >
                    <Avatar className="w-10 h-10 mr-4">
                      <AvatarImage
                        src={recipe.avatar.src}
                        alt="Recipe Avatar"
                        className="object-cover w-full h-full rounded-full"
                      />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow text-lg font-semibold">
                      {recipe.name}
                    </div>
                    <Button
                      variant="outline"
                      className="text-blue-500 border-2 border-blue-500 p-2 rounded-full"
                      onClick={() => handleLikeRecipe(recipe.id)}
                    >
                      <FaHeart />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
