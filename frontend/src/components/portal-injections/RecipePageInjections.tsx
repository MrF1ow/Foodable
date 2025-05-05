'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import { AddRecipe } from "@/components/forms/AddRecipe";
import AddItem from "@/components/forms/AddItem";
import UserPopup from "../popups/UserPopup";
import { useUserStore } from "@/stores/user/store";
import { useRouter } from "next/navigation";

export const RecipeSidePortalInjections = () => {
    const isUser = useUserStore((state) => state.isUser);
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentSidePortalForm);
    const setCurrentSidePortalForm = useGeneralStore((state) => state.setCurrentSidePortalForm);
    

    const sideList = <SideList isUser={isUser}/>;
    const recipeForm = <AddRecipe setCurrentForm={setCurrentSidePortalForm}/>;
    const addItemForm = <AddItem className="h-full" setCurrentForm={setCurrentSidePortalForm}/>;

    return (
        <>
            {currentForm === FORM_NAMES.CREATE_RECIPE && isUser && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={recipeForm}
                    changeShowPortal={true} />
            )}

            {currentForm === FORM_NAMES.ADD_ITEM_TO_LIST && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={addItemForm}
                    changeShowPortal={true} />
            )}

            {(currentForm === FORM_NAMES.GROCERY_LIST || currentForm === null) && (<PortalInjector
                containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                componentToInject={sideList} />
            )}
        </>
    );
}


export const RecipeMainPortalInjections = () => {
    const currentForm = useGeneralStore((state) => state.currentMainPortalForm);
    const setShowMainPortal = useGeneralStore((state) => state.setShowMainPortal);

    const router = useRouter();

    const additionalBackButtonClick = () => {
        setShowMainPortal(false);
        router.back();
    };

    const userPopup = <UserPopup additionalBackButtonClick={additionalBackButtonClick} className="lg:max-w-[45%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]" />

    return (
        <>
            {currentForm === FORM_NAMES.FOLLOWER_POPUP && (
                <PortalInjector
                    containerId="main-modal-portal"
                    componentToInject={userPopup}
                />
            )}
        </>
    );
}