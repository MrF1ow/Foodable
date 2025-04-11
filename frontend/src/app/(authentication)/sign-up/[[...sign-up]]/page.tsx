
import SignUp from "./sign-up";
import { redirect } from "next/navigation";
import { checkSession } from "@/lib/utils/roles";

export default async function SignUpPage() {

  // Check if the user is already signed in
  const user = await checkSession();

  if (user) {
    // Redirect to the grocery list page if the user is already signed in
    redirect("/recipe");
  }
  // If the user is not signed in, render the sign-in page
  return (
    <SignUp />
  )
}
