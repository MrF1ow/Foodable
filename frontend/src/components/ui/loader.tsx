import React from "react";

type SPLoaderProps = {
  loading: boolean;
};

export default function SPLoader({ loading }: SPLoaderProps) {
  return (
    <div className="flex justify-center items-center min-h-40">
      {loading ? (
        <img
          src="./images/load.svg" // replace with your actual loader path
          alt="Loading..."
          className="w-12 h-12"
        />
      ) : (
        <h3>Missing Loader</h3>
      )}
    </div>
  );
}