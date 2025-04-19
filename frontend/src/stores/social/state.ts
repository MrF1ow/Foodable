import { UserSections, SavedSections } from "@/types";
import { create } from "zustand";

export type SocialState = {
  savedItemsQuery: string;
  userQuery: string;
  currentFollowSection: UserSections
  currentSavedSection: SavedSections
};

export type SocialActions = {
  setSavedItemsQuery: (query: string) => void;
  setUserQuery: (query: string) => void;
  setCurrentFollowSection: (section: "following" | "followers") => void;
  setCurrentSavedSection: (section: "recipes" | "groceryLists") => void;
  resetSocialState: () => void;
};

export const createSocialActions = (set: any): SocialActions => ({
  setSavedItemsQuery: (query: string) =>
    set((state: SocialState) => ({ ...state, savedItemsQuery: query })),

  setUserQuery: (query: string) =>
    set((state: SocialState) => ({ ...state, userQuery: query })),

  setCurrentFollowSection: (section: "following" | "followers") =>
    set((state: SocialState) => ({ ...state, currentFollowSection: section })),

  setCurrentSavedSection: (section: "recipes" | "groceryLists") =>
    set((state: SocialState) => ({ ...state, currentSavedSection: section })),

  resetSocialState: () =>
    set(() => ({
      ...defaultInitState,
    })),
});

export type SocialStore = SocialState & SocialActions;

export const defaultInitState: SocialState = {
  savedItemsQuery: "",
  userQuery: "",
  currentFollowSection: 'following',
  currentSavedSection: 'recipes'
};

export const createSocialStore = (
  initState: SocialState = defaultInitState
) => {
  return create<SocialStore>()((set) => ({
    ...initState,
    ...createSocialActions(set),
  }));
};
