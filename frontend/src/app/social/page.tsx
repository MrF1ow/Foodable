"use client";

import * as React from "react";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main";
import { GeneralHeader } from "@/components/general-header";
import { ContentLayout, ModifiedContentLayout } from "@/layouts/content";
import { ScrollArea } from "@/components/ui/scroll-area";
import pfp from "../../../public/images/avatar.jpg";
import { Button } from "@/components/ui/button";

// SearchBar component for filtering following

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }
  
export const SearchBar1 = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="flex items-center w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find Following..."
          className="pl-10 pr-20 h-10 rounded-md bg-card-background text-foreground focus:outline-none"
        />
        <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-card-background text-foreground" />
      </div>
    </div>
  );
};

// SearchBar component for filtering recipes
export const SearchBar2 = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="flex items-center w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find Recipes..."
          className="pl-10 pr-20 h-10 rounded-md bg-card-background text-foreground focus:outline-none"
        />
        <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-card-background text-foreground" />
      </div>
    </div>
  );
};

export default function Social() {
  const [searchFollowingQuery, setSearchFollowingQuery] = React.useState(""); // Search query state for following
  const [searchRecipesQuery, setSearchRecipesQuery] = React.useState(""); // Search query state for recipes
  const [following, setFollowing] = React.useState([
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi"
  ])
  const [recipes, setRecipes] = React.useState([
    { name: "Spaghetti Bolognese", avatar: pfp, id: 1 },
    { name: "Chicken Curry", avatar: pfp, id: 2 },
    { name: "Sushi Rolls", avatar: pfp, id: 3 },
    { name: "Caesar Salad", avatar: pfp, id: 4 },
    { name: "Tacos", avatar: pfp, id: 5 },
  ])

  const filteredFollowing = React.useMemo(
    () => following.filter((name) => name.toLowerCase().includes(searchFollowingQuery.toLowerCase())),
    [searchFollowingQuery, following]
  );

  const filteredRecipes = React.useMemo(
    () => recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchRecipesQuery.toLowerCase())),
    [searchRecipesQuery, recipes]
  );

  const handleDelete = (name: string) => {
    setFollowing(following.filter((item) => item !== name)); // Remove the item from the list
  };

  const handleLikeRecipe = (id: number) => {
    console.log(`Recipe with ID ${id} liked!`);
  };
// bg card background
  const Content = () => {
    return (
      <div style={{ width: "100%", padding: "0" }}>
        {/* First large card */}
        <Card
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardContent className="card-bg-image">
            <div
              style={{
                position: "absolute",
                right: "20px",
                bottom: "20px", // Move the heart icon down inside the background line
                transform: "translateY(0%)", // Center vertically in the background area
                cursor: "pointer",
                zIndex: 10, // Keep the heart icon above other content
              }}
            >
              {/* Triple the size using fontSize */}
              <Icons.heart style={{ fontSize: "216px", color: "red" }} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50">
              <h1 className="text-6xl font-semibold text-white pl-[200px] truncate">
                {"John Doe"}
              </h1>
            </div>

            <div className="absolute bottom-4 left-4 p-2 bg-white rounded-full">
              <Avatar className="w-40 h-40 rounded-full">
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
      </div>
    );
  };

  const LeftSideContent = () => (
    <Card
      className="w-full h-[500px] p-4 m-0"
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <CardContent className="h-full">
        <ScrollArea className="w-full h-full">
          <div className="flex justify-start space-x-6 mb-4">
            <Button variant="default" className="text-2xl font-semibold bg-green-500 text-black px-6 py-2 rounded-md">
              Following
            </Button>
            <Button variant="outline" className="text-2xl font-semibold text-green-500 border-2 border-green-500 px-6 py-2 rounded-md">
              Followers
            </Button>
          </div>

          <div className="mt-4">
            <SearchBar1 searchQuery={searchFollowingQuery} setSearchQuery={setSearchFollowingQuery} />
          </div>

          <div className="mt-4">
            {filteredFollowing.map((name, index) => (
              <div key={index} className="flex items-center mb-4 bg-white p-4 rounded-md shadow-md">
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={pfp.src} alt="User Avatar" className="object-cover w-full h-full rounded-full" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-grow text-lg font-semibold text-gray-800">{name}</div>
                <Button variant="outline" className="text-red-500 border-2 border-red-500 p-2 rounded-full" onClick={() => handleDelete(name)}>
                  <Icons.minus />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const RightSideContent = () => (
    <Card
      className="w-full h-[500px] p-4 m-0"
      style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}
    >
      <CardContent className="bg-green-500 text-white p-4 rounded-t-md">
        <h2 className="text-xl font-semibold">Recipes</h2>
      </CardContent>
      <ScrollArea className="h-[calc(100%-80px)] p-4">
        <CardContent className="flex flex-col justify-center items-center h-full p-4">
          <SearchBar2 searchQuery={searchRecipesQuery} setSearchQuery={setSearchRecipesQuery} />
          <div className="mt-2 w-full">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center mb-4 bg-white p-4 rounded-md shadow-md">
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={recipe.avatar.src} alt="Recipe Avatar" className="object-cover w-full h-full rounded-full" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div className="flex-grow text-lg font-semibold text-gray-800">{recipe.name}</div>
                <Button variant="outline" className="text-red-500 border-2 border-red-500 p-2 rounded-full" onClick={() => handleLikeRecipe(recipe.id)}>
                  <Icons.heart />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );

  return (
    <MainLayout headerComponent={<GeneralHeader title={"Social"} width="50%" />}>
      <ModifiedContentLayout all={<Content />} />
      <div className="m-0">
        <ModifiedContentLayout
          split
          leftSide={<LeftSideContent />}
          rightSide={<RightSideContent />}
        />
      </div>
    </MainLayout>
  );
}