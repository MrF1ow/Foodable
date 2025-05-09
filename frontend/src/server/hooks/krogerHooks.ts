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
      return await KrogerApi.fetchKrogerLocations(zipCode);
    },
    retry: 0,
    enabled: !!zipCode,
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
    enabled: term.trim().length > 2,
    retry: 0,
  });

  return {
    krogerProducts,
    isLoadingKrogerProducts,
    refetchKrogerProducts,
    errorKrogerProducts,
  };
};
export const useFetchKrogerProductById = (
  productId: string,
  locationId?: string
) => {
  const {
    data: krogerProduct,
    isLoading: isLoadingKrogerProduct,
    refetch: refetchKrogerProduct,
    error: errorKrogerProduct,
    isError: isErrorKrogerProduct,
  } = useQuery({
    queryKey: ["krogerProductById", productId, locationId],
    queryFn: () => KrogerApi.fetchKrogerProductById(productId, locationId),
    enabled: !!productId,
    retry: 0,
  });

  return {
    krogerProduct,
    isLoadingKrogerProduct,
    refetchKrogerProduct,
    errorKrogerProduct,
  };
};
