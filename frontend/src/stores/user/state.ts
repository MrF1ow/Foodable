import { createStore } from "zustand/vanilla";

export type UserState = {
  id: string;
  username: string;
  email: string;
  // This is the JWT token that we will use to authenticate requests to the server, if it is null then the user is not authenticated
  authToken: string | null;
  preferences: {
    dietaryRestrictions: string[] | null;
    budget: number | null;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  // this is the date and time this user state was last updated, we will use this to determine if the user state is stale and needs to be refreshed
  updatedAt: Date;
  role: "guest" | "user" | "admin";
};

export type UserActions = {
  setId: (id: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setAuthToken: (authToken: string | null) => void;
  setPreferences: (preferences: UserState["preferences"]) => void;
  setLocation: (location: UserState["location"]) => void;
  setUpdatedAt: (updatedAt: Date) => void;
  setRole: (role: UserState["role"]) => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return {
    id: "",
    username: "",
    email: "",
    authToken: null,
    preferences: {
      dietaryRestrictions: null,
      budget: null,
    },
    updatedAt: new Date(),
    role: "guest",
  };
};

export const defaultInitState: UserState = {
  id: "",
  username: "",
  email: "",
  authToken: null,
  preferences: {
    dietaryRestrictions: null,
    budget: null,
  },
  updatedAt: new Date(),
  role: "guest",
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,

    // Define actions as part of the store
    setId: (id: string) => set((state) => ({ ...state, id })),

    setUsername: (username: string) => set((state) => ({ ...state, username })),

    setEmail: (email: string) => set((state) => ({ ...state, email })),

    setAuthToken: (authToken: string | null) =>
      set((state) => ({ ...state, authToken })),

    setPreferences: (preferences: UserState["preferences"]) =>
      set((state) => ({ ...state, preferences })),

    setLocation: (location: UserState["location"]) =>
      set((state) => ({ ...state, location })),

    setUpdatedAt: (updatedAt: Date) =>
      set((state) => ({ ...state, updatedAt })),

    setRole: (role: UserState["role"]) => set((state) => ({ ...state, role })),
  }));
};
