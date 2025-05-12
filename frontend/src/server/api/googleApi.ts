import { getValueFromSearchParams } from "@/lib/utils/api-helpers";
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
  fetchZipFromUserCoordinates: async (latitude: number, longitude: number) => {
    console.log("fetchZipFromUserCoordinates", latitude, longitude);
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response("Invalid coordinates", { status: 400 });
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key is not defined");
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
      const data = await response.json();
      console.log("fetchZipFromUserCoordinates response", data);
      const zipComponent = data.results
        ?.flatMap((result: any) => result.address_components)
        ?.find((component: any) => component.types.includes("postal_code"));
      if (!zipComponent) {
        return new Response("Postal code not found", { status: 404 });
      }
      return NextResponse.json(
        { zipCode: zipComponent.long_name },
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
      console.log("fetchUserLocation Google response", data);
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
