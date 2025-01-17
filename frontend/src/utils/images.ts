export const createImageUrl = async (response: Response): Promise<string> => {
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
};
