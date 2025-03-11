import { create } from "zustand";

import { UserPreferences } from "@/types/user";
import { UserSections } from "@/types";

export type UserState = {
  currentItemId: string | null;
  selectedUserSection: UserSections;
  searchQuery: string;
  language: string;
  preferences: {
    dietaryRestrictions: string[] | null;
    budget: number | null;
  };
};

export type UserActions = {
  setCurrentItemId: (currentItemId: string) => void;
  setSelectedUserSection: (selectedUserSection: UserSections) => void;
  setSearchQuery: (searchQuery: string) => void;
  setLanguage: (language: string) => void;
  setPreferences: (preferences: UserPreferences) => void;
};

export const createUserActions = (set: any): UserActions => ({
  setCurrentItemId: (currentItemId: string) =>
    set((state: UserState) => ({ ...state, currentItemId })),
  setSelectedUserSection: (selectedUserSection: UserSections) =>
    set((state: UserState) => ({ ...state, selectedUserSection })),
  setSearchQuery: (searchQuery: string) =>
    set((state: UserState) => ({ ...state, searchQuery })),
  setLanguage: (language: string) =>
    set((state: UserState) => ({ ...state, language })),

  setPreferences: (preferences: UserPreferences) =>
    set((state: UserState) => ({ ...state, preferences })),
});

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  currentItemId: null,
  selectedUserSection: "following",
  searchQuery: "",
  language: "en",
  preferences: {
    dietaryRestrictions: null,
    budget: null,
  },
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return create<UserStore>()((set) => ({
    ...initState,
    ...createUserActions(set),
  }));
};
