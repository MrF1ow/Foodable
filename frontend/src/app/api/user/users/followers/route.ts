import { GET as getAllFollowers } from "./getAllFollowers";

export async function GET() {
  return getAllFollowers();
}
