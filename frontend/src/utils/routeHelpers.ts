export function getValueFromSearchParams(req: Request, paramName: string) {
  const url = new URL(req.url);
  const value = url.searchParams.get(paramName);
  if (!value) {
    return null;
  }

  return value;
}
