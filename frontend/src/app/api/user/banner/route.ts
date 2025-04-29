import { GET as getBanner } from "./getBanner";
import { PUT as updateBanner } from "./updateBanner"

export async function GET() {
    return getBanner()
}

export async function PUT(req: Request) {
    return updateBanner(req);
}