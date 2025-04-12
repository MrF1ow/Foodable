'use client'

import Saved from "../../saved";
import SavePageInjections from "@/components/portal-injections/SavePageInjections";

export default function Page() {
    return (
        <>
            <Saved />
            <SavePageInjections />
        </>
    );
}