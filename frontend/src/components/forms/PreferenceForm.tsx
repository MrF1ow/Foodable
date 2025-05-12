'use client';

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
import { useUpdateUserPreferences } from "@/server/hooks/userHooks";

const onboardingSchema = z.object({
    budget: z
        .number({ invalid_type_error: "Budget must be a number" })
        .min(0, "Budget must be a positive number"),
    dietaryRestrictions: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
    foodTypePreferences: z
        .string()
        .transform((val) => val.split(",").map((s) => s.trim()))
        .refine((arr) => arr.length > 0, "Please enter at least one preference"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function OnboardingForm() {
    const { updateUserPreferences } = useUpdateUserPreferences();
    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            budget: 50,
            dietaryRestrictions: "",
            foodTypePreferences: "",
        } as any,
    });

    const handleSubmit = async (data: OnboardingData) => {
        try {
            const newPreferences = {
                budget: data.budget,
                dietaryRestrictions: data.dietaryRestrictions ?? [],
                foodTypePreferences: data.foodTypePreferences,
            };

            await updateUserPreferences(newPreferences);
        } catch (error) {
            console.error("Failed to update preferences", error);
        }
    };

    return (
        <Card className="w-full h-full bg-card-background text-foreground">
            <CardHeader className="text-center">
                <CardDescription className="mb-2">Let’s set up your preferences</CardDescription>
                <CardTitle className="text-xl">Personalize your Foodable experience</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dietaryRestrictions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dietary Restrictions (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Gluten-Free, Vegan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="foodTypePreferences"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Food Type Preferences (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Vegetarian, Plant-Based" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Save Preferences
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}