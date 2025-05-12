import { GET as getBanner } from "./getBanner";

export async function GET() {
    return getBanner()
}