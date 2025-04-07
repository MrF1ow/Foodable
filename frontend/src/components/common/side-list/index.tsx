import { SideList } from "./side-list-client";
import { checkRole } from "@/utils/roles";

export default async function SideListComponent() {
  const isUser = await checkRole("user");

  return <SideList isUser={isUser} />;
}
