"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

import SignUpForm from "@/components/authentication/SignUpForm";
import VerifyForm from "@/components/authentication/VerifyForm";

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");

    const signUpWithEmail = async ({
        username,
        emailAddress,
        password,
    }: {
        username: string;
        emailAddress: string;
        password: string;
    }) => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                username,
                emailAddress,
                password,
            });
            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // change the UI to our pending section.
            setVerifying(true);
        } catch (err: any) {
            setClerkError(err.errors[0].message);
        }
    };

    const handleVerify = async (e: FormEvent, code: string) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });
            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2));
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push("/recipe");
            }
        } catch (err) {
            console.log("Error:", JSON.stringify(err, null, 2));
        }
    };

    return (
        <>
            {!verifying ? (
                <SignUpForm signUpWithEmail={signUpWithEmail} clerkError={clerkError} />
            ) : (
                <VerifyForm handleVerify={handleVerify} code={code} setCode={setCode} />
            )}
        </>
    );
}
