import { GET as getAllFollowing } from "./getAllFollowing";

export async function GET() {
  return getAllFollowing();
}
