'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import RecipePopUp from "@/components/popups/RecipePopup";
import { useRouter } from "next/navigation";

export default function RecipePageInjections() {
    const currentForm = useGeneralStore((state) => state.currentForm);
    const setShowMainPortal = useGeneralStore((state) => state.setShowMainPortal);

    const router = useRouter();

    const additionalBackButtonClick = () => {
        setShowMainPortal(false);
        router.push("/social");
    };

    const sideList = <SideList isUser={true} additionalBackButtonClick={additionalBackButtonClick} />;

    const recipeForm = <RecipePopUp additionalBackButtonClick={additionalBackButtonClick} />;

    return (
        <>
            {currentForm === FORM_NAMES.RECIPE && (
                <PortalInjector
                    containerId="main-modal-portal"
                    componentToInject={recipeForm}
                    changeShowMainPortal={true} />
            )}
            {currentForm === FORM_NAMES.GROCERY_LIST && (
                <PortalInjector
                    containerId="main-modal-portal"
                    componentToInject={sideList}
                    changeShowMainPortal={true} />
            )}
        </>
    );
}