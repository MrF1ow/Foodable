import { JSX } from "react";

interface BoxProps {
    onClick: () => void;
    children: React.ReactNode;
}

export default function Box({ onClick, children }: BoxProps): JSX.Element {
    return (
        <div
            className="w-full sm:w-40 md:w-40 aspect-square rounded-lg relative shadow-lg overflow-hidden cursor-pointer z-10"
            onClick={onClick}
        >
            {children}
        </div>
    );
};
