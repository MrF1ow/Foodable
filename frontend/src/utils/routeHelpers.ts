export function getValueFromSearchParams(req: Request, paramName: string) {
  if (!req.url) {
    throw new Error("Request URL is undefined");
  }
  const url = new URL(req.url);
  const value = url.searchParams.get(paramName);
  if (!value) {
    return null;
  }

  return value;
}
