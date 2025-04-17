'use client';

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerticalOptionsButton() {
    return (
        <Button
            variant="outline"
            className="mr-2 p-6 px-4 flex items-center justify-center bg-card-background rounded-md hover:scale-105 hover:shadow-lg transition-all"
            data-testid="mobile-vertical-button"
        >
            <MoreVertical className="!h-6 !w-6" />
        </Button>
    )
}