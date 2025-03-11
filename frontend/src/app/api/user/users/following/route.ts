import { GET as getAllFollowing } from "./getAllFollowing";
import { DELETE as removeFollowing } from "./removeFollowing";

export async function GET() {
  return getAllFollowing();
}

export async function DELETE(req: Request) {
  return removeFollowing(req);
}
