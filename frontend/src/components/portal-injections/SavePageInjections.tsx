'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import RecipePopUp from "@/components/popups/RecipePopup";
import { useRouter } from "next/navigation";
import AddItem from "../forms/AddItem";


export default function SavePageInjections() {
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentSidePortalForm);
    const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
    const setCurrentForm = useGeneralStore((state) => state.setCurrentSidePortalForm);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);

    const router = useRouter();

    const additionalBackButtonClick = () => {
        setCurrentForm(null);
        setShowPortal(false);
        setSplitLayout(false);
        router.push("/saved");
    };

    const handleAddItemClose = () => {
        setCurrentForm(FORM_NAMES.GROCERY_LIST)
    }

    const sideList = <SideList isUser={true} additionalBackButtonClick={additionalBackButtonClick} />;

    const recipeForm = <RecipePopUp additionalBackButtonClick={additionalBackButtonClick}/>;

    const addItemForm = <AddItem className="h-full" handleClose={handleAddItemClose} setCurrentForm={setCurrentForm}/>;

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
            {currentForm === FORM_NAMES.ADD_ITEM_TO_LIST && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={addItemForm}
                />
            )}
        </>
    );
}