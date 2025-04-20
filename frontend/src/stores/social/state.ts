import { UserSections, SavedSections } from "@/types";
import { FollowMetadata, User } from "@/types/user";
import { create } from "zustand";

export type SocialState = {
  savedItemsQuery: string;
  userQuery: string;
  currentFollowSection: UserSections;
  currentSavedSection: SavedSections;
  selectedUser: User | null;
  isFollowerPopupOpen: boolean;
};

export type SocialActions = {
  setSavedItemsQuery: (query: string) => void;
  setUserQuery: (query: string) => void;
  setCurrentFollowSection: (section: UserSections) => void;
  setCurrentSavedSection: (section: SavedSections) => void;
  setSelectedUser: (user: User | null) => void;
  resetSocialState: () => void;
  setIsFollowerPopupOpen: (isOpen: boolean) => void;
};

export const createSocialActions = (set: any): SocialActions => ({
  setSavedItemsQuery: (query: string) =>
    set((state: SocialState) => ({ ...state, savedItemsQuery: query })),

  setUserQuery: (query: string) =>
    set((state: SocialState) => ({ ...state, userQuery: query })),

  setCurrentFollowSection: (section: UserSections) =>
    set((state: SocialState) => ({ ...state, currentFollowSection: section })),

  setCurrentSavedSection: (section: SavedSections) =>
    set((state: SocialState) => ({ ...state, currentSavedSection: section })),

  setSelectedUser: (user: User | null) =>
    set((state: SocialState) => ({ ...state, selectedUser: user })),

  setIsFollowerPopupOpen: (isOpen: boolean) =>
    set((state: SocialState) => ({ ...state, isFollowerPopupOpen: isOpen })),

  resetSocialState: () =>
    set(() => ({
      ...defaultInitState,
    })),
});

export type SocialStore = SocialState & SocialActions;

export const defaultInitState: SocialState = {
  savedItemsQuery: "",
  userQuery: "",
  currentFollowSection: "following",
  currentSavedSection: "recipes",
  selectedUser: null,
  isFollowerPopupOpen: false,
};

export const createSocialStore = (
  initState: SocialState = defaultInitState
) => {
  return create<SocialStore>()((set) => ({
    ...initState,
    ...createSocialActions(set),
  }));
};
