import { GET as getCurrentList } from "./getCurrentList";
import { POST as postCurrentList } from "./postCurrentList";

export async function GET() {
  return getCurrentList();
}

export async function POST(req: Request) {
  return postCurrentList(req);
}
