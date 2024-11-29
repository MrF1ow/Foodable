export function getIdFromSearchParams(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return null;
  }

  return id;
}

export function getCreatorIdFromSearchParams(req: Request) {
  const url = new URL(req.url);
  const creatorId = url.searchParams.get("creatorId");
  if (!creatorId) {
    return null;
  }

  return creatorId;
}

export function getRecipeTitleFromSearchParams(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  if (!title) {
    return null;
  }

  return title;
}
