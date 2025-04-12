import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";
import { NextResponse } from "next/server";

export const GoogleApi = {
  fetchUserLocationFromZip: async (zipCode: string) => {
    if (!zipCode || zipCode.length !== 5) {
      return new Response("Invalid zipCode", { status: 400 });
    }
    console.log("Zipcode from getLocationFromZip:", zipCode);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key is not defined");
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
      const data = await response.json();
      const { lat, lng } = data.results[0].geometry.location;
      return NextResponse.json(
        { latitude: lat, longitude: lng },
        { status: 200 }
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  fetchUserLocation: async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key is not defined");
    }
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("fetchUserLocation response", data);
      const { lat, lng } = data.location;
      return NextResponse.json(
        { latitude: lat, longitude: lng },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error getting user location: ", error.message);
      throw error;
    }
  },
};
