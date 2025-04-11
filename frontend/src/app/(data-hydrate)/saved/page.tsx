import { checkRole } from "@/lib/utils/roles";
import Saved from "./saved";
import AuthOptions from "@/components/authentication/AuthOptions";

export default async function SavedPage() {
  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <>
      {isUser && <Saved />}
      {!isUser && <AuthOptions />}
    </>
  );
}
