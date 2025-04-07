
import { checkRole } from "@/utils/roles";
import Social from "./social";
import AuthOptions from "@/components/auth-options";
import FetchUserData from "../../_fetchData";

export default async function SocialPage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <>
      {isUser && <Social />}
      {!isUser && <AuthOptions />}
    </>
  );
}
