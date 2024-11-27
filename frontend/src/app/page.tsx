"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowLogo(window.innerWidth > 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-between px-8 lg:px-16 font-league">
      {/* Title and Button Section */}
      <div className="flex flex-col space-y-2 text-center w-full md:text-left md:w-1/2">
        <h1 className="text-4xl lg:text-6xl font-bold">Foodable</h1>
        <h2 className="text-lg lg:text-2xl text-gray-600">
          Making Food More Doable.
        </h2>
      </div>
      {/* Logo Section (Hidden on smaller screens) */}
      {showLogo && (
        <div>
          <h1 className="text-3xl font-bold">LOGO HERE</h1>
        </div>
      )}
    </div>
  );
}
