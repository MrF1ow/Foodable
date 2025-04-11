'use client';

import { Button } from "../ui/button";
import { Icons } from "../ui/icons";


export default function AssistantButton({
    className,
    mobile,
    handleOnClick,
}: {
    className?: string;
    mobile: boolean;
    handleOnClick: () => void;
}) {
    return (
        <Button
            className={`btn-primary rounded-full w-12 h-12 hover:bg-primary flex items-center justify-center fixed bottom-4 right-4 z-50 ${mobile ? "mb-16" : ""
                }`}
            data-testid="helper-button"
            onClick={() =>
                handleOnClick()
            }
        >
            <Icons.ai className="!w-6 !h-6" />
        </Button>
    );
}