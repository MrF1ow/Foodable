import { GoogleApi } from "../api/googleApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserLocation = () => {
  const {
    data: userLocation,
    isLoading: isLoadingUserLocation,
    refetch: refetchUserLocation,
    error: errorUserLocation,
    isError: isErrorUserLocation,
  } = useQuery({
    queryKey: ["userLocation"],
    queryFn: async () => {
      const response = await GoogleApi.fetchUserLocation();
      return response.json();
    },
    retry: 0,
  });

  return {
    userLocation,
    isLoadingUserLocation,
    refetchUserLocation,
    errorUserLocation,
  };
};

export const useFetchZipFromCoordinates = (latitude: number, longitude: number) => {
    const {
      data: userZipCode,
      isLoading: isLoadingZipCode,
      refetch: refetchZipCode,
      error: errorZipCode,
      isError: isErrorZipCode,
    } = useQuery({
      queryKey: ["userZipCode", latitude, longitude],
      queryFn: async () => {
        const response = await GoogleApi.fetchZipFromUserCoordinates(latitude, longitude);
        return response.json();
      },
      enabled: typeof latitude === "number" && typeof longitude === "number",
      retry: 0,
    });
  
    return {
      userZipCode,
      isLoadingZipCode,
      refetchZipCode,
      errorZipCode,
    };
  };

export const useFetchUserLocationFromZip = (zipCode: string) => {
  const {
    data: userLocationFromZip,
    isLoading: isLoadingUserLocationFromZip,
    refetch: refetchUserLocationFromZip,
    error: errorUserLocationFromZip,
    isError: isErrorUserLocationFromZip,
  } = useQuery({
    queryKey: ["userLocation", zipCode],
    queryFn: () => GoogleApi.fetchUserLocationFromZip(zipCode),
    retry: 0,
  });

  return {
    userLocationFromZip,
    isLoadingUserLocationFromZip,
    refetchUserLocationFromZip,
    errorUserLocationFromZip,
  };
};
