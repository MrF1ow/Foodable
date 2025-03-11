import { GET as getPreferences } from "./getPreferences";
import { PUT as updatePreferences } from "./updatePreferences";

export async function GET() {
  return getPreferences();
}

export async function PUT(req: Request) {
  return updatePreferences(req);
}
