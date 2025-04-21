'use client';

import Spinner from "@/components/Spinner";
import { getRouteParam } from "@/lib/utils/routeHelpers";
import { useParams } from "next/navigation";
import { useState } from "react";
import Social from "../../social";
import SocialPageInjections from "@/components/portal-injections/SocialPageInjections";

export default function Page() {
    const [loading, setLoading] = useState(true);

    const params = useParams<{ id: string }>();
    const id = params.id;
    const userId = getRouteParam(id);

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Social />
            <SocialPageInjections />
        </>
    );
}
