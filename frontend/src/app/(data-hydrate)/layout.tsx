import { HydrationBoundary } from "@tanstack/react-query";
import FetchUserData from "../_fetchData";

export default async function DataHydrateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dehydratedClient = await FetchUserData();
    return (
        <HydrationBoundary state={dehydratedClient}>
            {children}
        </HydrationBoundary>

    );
}