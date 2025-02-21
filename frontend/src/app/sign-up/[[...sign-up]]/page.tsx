"use client";

import { useRouter } from "next/navigation";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import { completeOnboarding } from "./_actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { AuthenticationLayout } from "@/layouts/common/authentication";

export default function SignUpPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleSignUpComplete = async () => {
    try {
      const response = await completeOnboarding();
      if (response.error) {
        console.error("Onboarding Error:", response.error);
      } else {
        await user?.reload();
        router.push("/recipes");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="grid w-full grow items-center px-4 sm:justify-center">
        <SignUp.Root>
          <Clerk.Loading>
            {(isGlobalLoading) => (
              <SignUp.Step name="start">
                <h1 className="absolute hidden lg:block lg:top-20 left-1/2 transform -translate-x-1/2 text-primary lg:text-4xl font-bold">
                  Foodable
                </h1>
                <Card className="w-full sm:w-96 bg-card-background text-foreground">
                  <CardHeader className="text-center">
                    <CardDescription className="mb-2">
                      Welcome!👋
                    </CardDescription>
                    <CardTitle className="text-xl">
                      Create your account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Clerk.Field name="first_name" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>First Name</Label>
                        </Clerk.Label>
                        <Clerk.Input required asChild>
                          <Input className="bg-background" />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                      <Clerk.Field name="last_name" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Last Name</Label>
                        </Clerk.Label>
                        <Clerk.Input required asChild>
                          <Input className="bg-background" />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </div>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input className="bg-background" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type="password" required asChild>
                        <Input className="bg-background" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Captcha className="empty:hidden" />
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Sign Up"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                      <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                        or
                      </p>
                      <div className="w-full">
                        <Clerk.Connection name="google" asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            disabled={isGlobalLoading}
                            className="w-full"
                          >
                            <Clerk.Loading scope="provider:google">
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  <>
                                    <Icons.google className="mr-2 size-4" />
                                    Google
                                  </>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>
                      </div>
                      <Button variant="link" size="sm" asChild>
                        <Clerk.Link navigate="sign-in">
                          Already have an account? Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>
            )}
          </Clerk.Loading>
        </SignUp.Root>
      </div>
    </AuthenticationLayout>
  );
}
