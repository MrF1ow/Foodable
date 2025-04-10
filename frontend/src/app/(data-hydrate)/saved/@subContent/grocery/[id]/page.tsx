'use client'

import { SideList } from "@/components/common/side-list/side-list-client";
import { useGeneralStore } from "@/stores/general/store";
import { useRouter } from "next/navigation";

export default function Page() {
    const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
    const router = useRouter();
    const additionalBackButtonClick = () => {
        setSplitLayout(false);
        router.back();
    };
    return (
        <>
            <SideList isUser={true} additionalBackButtonClick={additionalBackButtonClick} />
        </>
    );
}