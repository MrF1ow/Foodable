
import { checkRole } from "@/lib/utils/roles";
import Social from "./social";
import AuthOptions from "@/components/authentication/AuthOptions";

export default async function SocialPage() {
  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <>
      {isUser && <Social />}
      {!isUser && <AuthOptions />}
    </>
  );
}
