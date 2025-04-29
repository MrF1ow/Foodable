import { GET as getAllFollowing } from "./getAllFollowing";
import { DELETE as removeFollowing } from "./removeFollowing";
import { POST as followUser } from "./followUser"

export async function GET() {
  return getAllFollowing();
}

export async function DELETE(req: Request) {
  return removeFollowing(req);
}

export async function PUT(req: Request) {
  return followUser(req);
}
