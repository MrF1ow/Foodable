import SideList from "./SideList";
import { checkRole } from "@/lib/utils/roles";

export default async function SideListComponent() {
  const isUser = await checkRole("user");

  return <SideList isUser={isUser} />;
}
