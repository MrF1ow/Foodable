import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { getIpAddress } from "./utils";
import { NextResponse, NextRequest } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "10 s"),
});

export default async function rateLimit(req: NextRequest): Promise<NextResponse | void> {
  const identifier = getIpAddress(req);
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return NextResponse.next();
}

