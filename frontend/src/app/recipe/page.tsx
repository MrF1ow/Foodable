import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import searchIcon from "../../../public/images/search_icon_google.png";
import tuneIcon from "../../../public/images/tune_google.png";
import { Card, CardTitle } from "@/components/ui/card";

const cardData = [
  {
    id: 1,
    title: "Recipe 1",
    userRatings: [
      {
        rating: 5,
      },
    ],
  },
  {
    id: 2,
    title: "Recipe 2",
    userRatings: [
      {
        rating: 4,
      },
    ],
  },
  {
    id: 3,
    title: "Recipe 3",
    userRatings: [
      {
        rating: 2,
      },
    ],
  },
  {
    id: 4,
    title: "Recipe 4",
    userRatings: [
      {
        rating: 3,
      },
    ],
  },
  {
    id: 5,
    title: "Recipe 5",
    userRatings: [
      {
        rating: 4,
      },
    ],
  },
  {
    id: 6,
    title: "Recipe 6",
    userRatings: [
      {
        rating: 1,
      },
    ],
  },
  {
    id: 7,
    title: "Recipe 7",
    userRatings: [
      {
        rating: 5,
      },
    ],
  },
  {
    id: 8,
    title: "Recipe 8",
    userRatings: [
      {
        rating: 3,
      },
    ],
  },
  {
    id: 9,
    title: "Recipe 9",
    userRatings: [
      {
        rating: 4,
      },
    ],
  },
  {
    id: 10,
    title: "Recipe 10",
    userRatings: [
      {
        rating: 5,
      },
    ],
  },
  {
    id: 11,
    title: "Recipe 11",
    userRatings: [
      {
        rating: 2,
      },
    ],
  },
  {
    id: 12,
    title: "Recipe 12",
    userRatings: [
      {
        rating: 3,
      },
    ],
  },
];

export default function RecipePage() {
  //   const [recipes, setRecipes] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   useEffect(() => {
  //     // Fetch recipes from the API
  //     async function fetchRecipes() {
  //       try {
  //         const response = await fetch("/api/recipes");
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch recipes");
  //         }
  //         const data = await response.json();
  //         setRecipes(data);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     fetchRecipes();
  //   }, []);

  return (
    <div className="p-4">
      <div className="relative w-full max-w-lg mb-8">
        <Button
          variant="outline"
          className="absolute inset-y-0 left-0 px-4 text-white bg-black border-0 rounded-l-lg focus:ring-0 hover:bg-gray-800 hover:text-white"
        >
          <Image
            src={searchIcon}
            alt="Search Icon"
            width={25}
            height={25}
            className="object-contain"
          />
        </Button>

        <Button
          variant="outline"
          className="absolute inset-y-0 right-0 px-4 text-white bg-black border-0 rounded-r-lg focus:ring-0 hover:bg-gray-800 hover:text-white"
        >
          <Image
            src={tuneIcon}
            alt="Tune Icon"
            width={25}
            height={25}
            className="object-contain"
          />
        </Button>

        <Input
          type="text"
          placeholder="Find Recipes ..."
          className="pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-18 md:pr-18 bg-black text-white placeholder-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="w-full max-w-screen-lg">
        <div className="flex flex-wrap justify-start gap-4">
          {cardData.map((card) => (
            <Card
              key={card.id}
              className="w-full sm:w-40 md:w-40 bg-gray-800 text-white shadow-lg aspect-square border-green-500 flex flex-col rounded-lg"
            >
              <div className="flex-grow p-4"></div>
              <div
                className="flex flex-row items-center justify-between p-4 w-full rounded-b-lg"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <CardTitle className="mr-2">{card.title}</CardTitle>
                <span className="ml-2">{card.userRatings[0].rating} ☆</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
