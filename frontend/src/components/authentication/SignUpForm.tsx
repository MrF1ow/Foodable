"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SignUpFormProps {
  signUpWithEmail: ({
    username,
    emailAddress,
    password,
  }: {
    username: string;
    emailAddress: string;
    password: string;
  }) => void;
  clerkError: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(12, "Username must be at most 12 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignUpForm = ({ signUpWithEmail, clerkError }: SignUpFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { username, email, password } = data;
    signUpWithEmail({ username, emailAddress: email, password });
  };

  return (
    <Card className="w-full h-full bg-card-background text-foreground">
      <CardHeader className="text-center">
        <CardDescription className="mb-2">Welcome!👋</CardDescription>
        <CardTitle className="text-xl">Create an Account</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      type="username"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      type="email"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h2 className="text-red mb-8">
              {clerkError && <p>{clerkError}</p>}
            </h2>
            <div className="grid w-full gap-y-4">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <Link
                href="/sign-in"
                className="text-center text-sm text-muted-foreground hover:text-primary"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
