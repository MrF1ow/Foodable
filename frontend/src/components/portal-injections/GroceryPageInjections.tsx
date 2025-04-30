'use client';

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import AddItem from "@/components/forms/AddItem";
import FindPrice from "@/components/forms/FindPrice";
import ListHelper from "@/components/forms/ListHelper";
import { FORM_NAMES } from "@/lib/constants/forms";
import { useUserStore } from "@/stores/user/store";

export default function GroceryPageInjections() {
    const isUser = useUserStore((state) => state.isUser);
    const isMobile = useGeneralStore((state) => state.isMobile);
    const currentForm = useGeneralStore((state) => state.currentSidePortalForm);
    const setCurrentSidePortalForm = useGeneralStore((state) => state.setCurrentSidePortalForm);

    const addItemForm = <AddItem className="h-full" setCurrentForm={setCurrentSidePortalForm}/>;
    const findPriceForm = <FindPrice setCurrentForm={setCurrentSidePortalForm}/>;
    const listHelperForm = <ListHelper setCurrentForm={setCurrentSidePortalForm}/>;

    return (
        <>
            {currentForm === FORM_NAMES.ADD_ITEM_TO_LIST && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={addItemForm}
                    changeShowPortal={true} />
            )}

            {currentForm === FORM_NAMES.FIND_PRICE && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={findPriceForm}
                    changeShowPortal={true} />
            )}

            {currentForm === FORM_NAMES.LIST_ASSISTANT && isUser && (
                <PortalInjector
                    containerId={isMobile ? "content-mobile-portal" : "content-split-portal"}
                    componentToInject={listHelperForm}
                    changeShowPortal={true} />
            )}

        </>
    );
}