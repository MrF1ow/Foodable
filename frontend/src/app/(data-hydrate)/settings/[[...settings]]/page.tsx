import { checkRole } from "@/lib/utils/roles";
import Settings from "./settingsPage";
import AuthOptions from "@/components/authentication/AuthOptions";

export default async function SettingsPage() {
  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <>
      {isUser && <Settings />}
      {!isUser && <AuthOptions />}
    </>
  );
}
