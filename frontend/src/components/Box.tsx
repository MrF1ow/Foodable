import { JSX } from "react";

interface BoxProps {
    onClick: () => void;
    children: React.ReactNode;
    width: string;
}

export default function Box({ onClick, children, width }: BoxProps): JSX.Element {
    return (
        <div
            className={`aspect-square rounded-lg relative shadow-lg overflow-hidden cursor-pointer z-10 ${width}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
