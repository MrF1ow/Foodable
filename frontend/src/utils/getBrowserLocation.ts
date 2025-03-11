export const getBrowserLocation = async (): Promise<
  { latitude: number; longitude: number } | undefined
> => {
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      return { latitude, longitude };
    } catch (error: any) {
      console.warn("Browser geolocation failed:", error.message);
      return undefined;
    }
  }

  return undefined;
};
