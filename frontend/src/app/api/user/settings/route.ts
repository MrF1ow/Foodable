import { GET as getSettings } from "./getSettings";
import { PUT as updateSettings } from "./updateSettings";

export async function GET() {
  return getSettings();
}

export async function PUT(req: Request) {
  return updateSettings(req);
}
