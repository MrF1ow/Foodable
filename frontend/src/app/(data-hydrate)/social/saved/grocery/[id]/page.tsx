'use client'

import { useRouter } from "next/navigation";
import SideList from "@/components/side-list/SideList";

export default function Page() {
    const router = useRouter();

    const additionalBackButtonClick = () => {
        router.push("/social");
    };

    return (
        <>
            <SideList isUser={true} additionalBackButtonClick={additionalBackButtonClick} />
        </>
    );
}