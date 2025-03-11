import { DELETE as removeFollower } from "./removeFollower";
import { GET as getAllFollowers } from "./getAllFollowers";

export async function DELETE(req: Request) {
  return removeFollower(req);
}

export async function GET() {
  return getAllFollowers();
}
