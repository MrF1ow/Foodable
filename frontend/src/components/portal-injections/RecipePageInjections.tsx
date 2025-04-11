'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import { SideList } from "@/components/common/side-list/side-list-client";
import { AddRecipe } from "../common/recipe/add-recipe";
import AddItem from "@/components/forms/AddItem";


export default function RecipePageInjections() {
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentForm);

    const sideList = <SideList isUser={true} />;
    const recipeForm = <AddRecipe />; const addItemForm = <AddItem className="h-full" />;


    return (
        <>
            {currentForm === FORM_NAMES.CREATE_RECIPE && (
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