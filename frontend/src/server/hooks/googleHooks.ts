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
    queryFn: () => GoogleApi.fetchUserLocation(),
    retry: 0,
  });

  return {
    userLocation,
    isLoadingUserLocation,
    refetchUserLocation,
    errorUserLocation,
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
