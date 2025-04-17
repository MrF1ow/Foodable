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
  CardFooter,
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

interface SignInFormProps {
  signInWithEmail: ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => void;
  clerkError: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignInForm = ({ signInWithEmail, clerkError }: SignInFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    signInWithEmail({ emailAddress: email, password });
  };

  return (
    <Card className="w-full h-full bg-card-background text-foreground">
      <CardHeader className="text-center">
        <CardDescription className="mb-2">Welcome back!👋</CardDescription>
        <CardTitle className="text-xl">Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
            <h2 className="text-slate-700 mb-8">
              {clerkError && <p>{clerkError}</p>}
            </h2>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
        <CardFooter className="flex w-full items-center justify-center">
          <Button variant="link" size="sm">
            <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
