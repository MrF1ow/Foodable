import { create } from "zustand";

import { UserPreferences } from "@/types/user";

export type UserState = {
  isUser: boolean;
  bannerId: string | null;
  currentItemId: string | null;
  language: string;
  preferences: {
    dietaryRestrictions: string[] | null;
    budget: number | null;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type UserActions = {
  setIsUser: (isUser: boolean) => void;
  setBannerId: (bannerId: string | null) => void;
  setCurrentItemId: (currentItemId: string) => void;
  setLanguage: (language: string) => void;
  setPreferences: (preferences: UserPreferences) => void;
  setLocation: (location: UserState["location"]) => void;
};

export const createUserActions = (set: any): UserActions => ({
  setIsUser: (isUser: boolean) =>
    set((state: UserState) => ({ ...state, isUser })),
  setBannerId: (bannerId) => {
    set((state: UserState) => ({ ...state, bannerId }))
  },
  setCurrentItemId: (currentItemId: string) =>
    set((state: UserState) => ({ ...state, currentItemId })),
  setLanguage: (language: string) =>
    set((state: UserState) => ({ ...state, language })),
  setPreferences: (preferences: UserPreferences) =>
    set((state: UserState) => ({ ...state, preferences })),
  setLocation: (location: UserState["location"]) =>
    set((state: UserState) => ({ ...state, location })),
});

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  isUser: false,
  bannerId: null,
  currentItemId: null,
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
