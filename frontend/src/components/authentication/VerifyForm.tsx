// app/components/VerifyForm.tsx
import { FormEvent } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface VerifyFormProps {
  handleVerify: (e: FormEvent, code: string) => void;
  code: string;
  setCode: (value: string) => void;
}

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyForm = ({ handleVerify, code, setCode }: VerifyFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { code },
  });

  return (
    <Card className="w-full sm:w-96 bg-card-background text-foreground">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verification Code</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-y-4">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit((data) => handleVerify(e, data.code))(e);
            }}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={(value) => {
                        field.onChange(value); // Update react-hook-form state
                        setCode(value); // Sync external state
                      }}
                      value={code}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VerifyForm;
