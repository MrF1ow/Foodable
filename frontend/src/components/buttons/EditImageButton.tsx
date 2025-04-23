'use client'

import { Button } from "@/components/ui/button"
import { MdEdit } from "react-icons/md"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { getChangeImageFormValidation } from "@/lib/utils/formValidation"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { useState } from "react"

interface EditImageButtonProps {
    iconClassName: string
}

export default function EditImageButton({ iconClassName }: EditImageButtonProps) {

    const [isOpen, setIsOpen] = useState(false);

    const { ChangeImageFormSchema, defaultValues, resolver } = getChangeImageFormValidation()

    const form = useForm<z.infer<typeof ChangeImageFormSchema>>({
        defaultValues,
        resolver
    })

    const handleFormSubmit = async (data: z.infer<typeof ChangeImageFormSchema>) => {
        if (data.image) {
            console.log("Image selected, submitting form...");
            setIsOpen(false);
        } else {
            console.log("No image selected, dialog stays open.");
        }
    }

    return (
        <>
            <MdEdit
                className={iconClassName}
                onClick={() => setIsOpen(true)}
                role="button"
                aria-label="Edit image"
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Change Image</DialogTitle>
                        <DialogDescription>Select an Image to replace current Image</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <div>
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <label className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition text-lg">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        field.onChange(file);
                                                    }}
                                                    data-testid="edit-image-input"
                                                />
                                                {field.value?.name || "Click to upload image"}
                                            </label>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                onClick={form.handleSubmit(handleFormSubmit)}
                                className="btn-primary p-2 m-2 transition-all hover:scale-[101%] hover:shadow-lg text-xl w-full"
                                data-testid="submit-button"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}