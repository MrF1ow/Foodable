import { checkRole } from "@/utils/roles";
import Saved from "./saved";
import AuthOptions from "@/components/auth-options";
import FetchUserData from "../../_fetchData";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <>
      {isUser && <Saved />}
      {!isUser && <AuthOptions />}
    </>
  );
}
