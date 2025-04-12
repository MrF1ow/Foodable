import { HydrationBoundary } from "@tanstack/react-query";
import FetchUserData from "../_fetchData";
import { QueryClientProvider } from "@tanstack/react-query";

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