import { create } from "zustand";

export type UserState = {
  language: string;
  preferences: {
    dietaryRestrictions: string[] | null;
    budget: number | null;
  };
};

export type UserActions = {
  setLanguage: (language: string) => void;
  setPreferences: (preferences: UserState["preferences"]) => void;
};

export const createUserActions = (set: any): UserActions => ({
  setLanguage: (language: string) =>
    set((state: UserState) => ({ ...state, language })),

  setPreferences: (preferences: UserState["preferences"]) =>
    set((state: UserState) => ({ ...state, preferences })),
});

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
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
