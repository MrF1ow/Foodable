'use client'

import Social from "@/app/(data-hydrate)/social/social"
import SocialPageInjections from '@/components/portal-injections/SocialPageInjections'

export default function Page() {

    return (
        <>
            <Social />
            <SocialPageInjections />
        </>
    );
}