'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import { AddRecipe } from "@/components/forms/AddRecipe";
import AddItem from "@/components/forms/AddItem";
import { useUserStore } from "@/stores/user/store";


export default function RecipePageInjections() {
    const isUser = useUserStore((state) => state.isUser);
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentForm);

    console.log("isUser from Recipe Injections ", isUser);

    const sideList = <SideList isUser={isUser} />;
    const recipeForm = <AddRecipe />;
    const addItemForm = <AddItem className="h-full" />;


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