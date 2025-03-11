import { KrogerApi } from "../api/krogerApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchKrogerLocations = (zipCode: string) => {
  const {
    data: krogerLocations,
    isLoading: isLoadingKrogerLocations,
    refetch: refetchKrogerLocations,
    error: errorKrogerLocations,
    isError: isErrorKrogerLocations,
  } = useQuery({
    queryKey: ["krogerLocations", zipCode],
    queryFn: async () => {
      const response = await KrogerApi.fetchKrogerLocations(zipCode);
      return response.json();
    },
    retry: 0,
  });

  return {
    krogerLocations,
    isLoadingKrogerLocations,
    refetchKrogerLocations,
    errorKrogerLocations,
  };
};

export const useFetchKrogerProducts = (term: string, locationId?: string) => {
  const {
    data: krogerProducts,
    isLoading: isLoadingKrogerProducts,
    refetch: refetchKrogerProducts,
    error: errorKrogerProducts,
    isError: isErrorKrogerProducts,
  } = useQuery({
    queryKey: ["krogerProducts", term, locationId],
    queryFn: () =>
      term ? KrogerApi.fetchKrogerProducts(term, locationId) : null,
    retry: 0,
  });

  return {
    krogerProducts,
    isLoadingKrogerProducts,
    refetchKrogerProducts,
    errorKrogerProducts,
  };
};
