'use client'

import { Button } from "@/components/ui/button"
import { MdEdit } from "react-icons/md"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { getChangeImageFormValidation } from "@/lib/utils/formValidation"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { useEffect, useState } from "react"

interface EditImageButtonProps {
    handleSubmit: (image: File) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    iconClassName: string;
    currentImageId: string | null;
}

export default function EditImageButton({ iconClassName, handleSubmit, handleDelete, currentImageId }: EditImageButtonProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { ChangeImageFormSchema, defaultValues, resolver } = getChangeImageFormValidation()

    const form = useForm<z.infer<typeof ChangeImageFormSchema>>({
        defaultValues,
        resolver
    })

    const handleFormSubmit = async (data: z.infer<typeof ChangeImageFormSchema>) => {
        if (data.image) {
            console.log("Image selected, submitting form...");
            await handleSubmit(data.image);
            setIsOpen(false);
        } else {
            console.log("No image selected, dialog stays open.");
        }
    }

    const handleDeleteImage = async () => {
        if (currentImageId) {
            try {
                console.log("Deleting image with ID:", currentImageId);
                await handleDelete(currentImageId);
                setIsOpen(false);
            } catch (error) {
                console.error("Failed to delete image:", error);
            }
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setPreviewUrl(null);
            form.reset();
        }
    }, [isOpen, form]);

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

                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setPreviewUrl(url);
                                                        } else {
                                                            setPreviewUrl(null);
                                                        }
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
                            {previewUrl && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-h-48 rounded-md border"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4">
                            <Button
                                type="submit"
                                onClick={form.handleSubmit(handleFormSubmit)}
                                className="btn-primary p-2 m-2 transition-all hover:scale-[101%] hover:shadow-lg text-xl w-full"
                                data-testid="submit-button"
                            >
                                Submit
                            </Button>
                            {currentImageId && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDeleteImage}
                                    className="p-2 m-2 transition-all hover:scale-[101%] hover:shadow-lg text-xl w-full"
                                    data-testid="delete-button"
                                >
                                    Delete Image
                                </Button>
                            )}
                        </div>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}