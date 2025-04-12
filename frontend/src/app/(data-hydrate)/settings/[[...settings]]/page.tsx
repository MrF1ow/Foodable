import { checkRole } from "@/utils/roles";
import Settings from "./settingsPage";
import AuthOptions from "@/components/auth-options";

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
