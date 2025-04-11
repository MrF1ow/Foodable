'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import { SideList } from "@/components/common/side-list/side-list-client";
import { RecipePopUp } from "../common/recipe/recipe-popup";
import { useRouter } from "next/navigation";


export default function RecipePageInjections() {
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentForm);
    const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

    const router = useRouter();

    const additionalBackButtonClick = () => {
        setSplitLayout(false);
        router.push("/saved");
    };

    const sideList = <SideList isUser={true} additionalBackButtonClick={additionalBackButtonClick} />;

    const recipeForm = <RecipePopUp additionalBackButtonClick={additionalBackButtonClick} />;

    return (
        <>
            {currentForm === FORM_NAMES.RECIPE && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={recipeForm}
                    changeShowPortal={true} />
            )}
            {currentForm === FORM_NAMES.GROCERY_LIST && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={sideList}
                    changeShowPortal={true} />
            )}
        </>
    );
}