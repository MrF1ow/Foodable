import { GET as getCreatedItems } from "./getCreatedItems";

export async function GET() {
  return getCreatedItems();
}
