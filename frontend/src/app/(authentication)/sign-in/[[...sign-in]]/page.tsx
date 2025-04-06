
import SignIn from "./sign-in";
import { redirect } from "next/navigation";
import { checkSession } from "@/utils/roles";

export default async function SignInPage() {

  // Check if the user is already signed in
  const user = await checkSession();
  if (user) {
    // Redirect to the grocery list page if the user is already signed in
    redirect("/grocery-list");
  }
  // If the user is not signed in, render the sign-in page
  return (
    <SignIn />
  )
}
