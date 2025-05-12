import { POST as postQuery } from "./postQuery"

export async function POST(req: Request) {
    return postQuery(req);
}