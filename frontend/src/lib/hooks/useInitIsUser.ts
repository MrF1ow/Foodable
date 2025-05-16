// lib/hooks/useInitIsUser.ts

'use client';

import { useEffect } from "react";
import { useUserStore } from "@/stores/user/store";

export const useInitIsUser = (user: boolean) => {
    const setIsUser = useUserStore((state) => state.setIsUser);

    useEffect(() => {
        setIsUser(user);
    }, [user, setIsUser]);
};