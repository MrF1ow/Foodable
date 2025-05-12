import SideList from "./SideList";
import { checkRole } from "@/lib/utils/clerk-utils";

export default async function SideListComponent() {
  const isUser = await checkRole("user");

  return <SideList isUser={isUser} />;
}
