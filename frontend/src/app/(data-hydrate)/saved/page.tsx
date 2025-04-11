import { checkRole } from "@/utils/roles";
import Saved from "./saved";
import AuthOptions from "@/components/auth-options";

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
