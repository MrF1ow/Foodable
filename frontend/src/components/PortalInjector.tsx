'use client';

import { JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGeneralStore } from "@/stores/general/store";

export default function PortalInjector({
    containerId,
    componentToInject,
    changeShowPortal = false,
}: {
    containerId: string;
    componentToInject: React.ReactElement;
    changeShowPortal?: boolean;
}): JSX.Element | null {
    const [mounted, setMounted] = useState(false);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);

    useEffect(() => {
        setMounted(true);
        if (changeShowPortal) {
            setShowPortal(true);
        }
    }, []);

    if (!mounted) return null;

    const target = document.getElementById(containerId);
    if (!target) return null;

    return createPortal(
        componentToInject,
        target
    );
}