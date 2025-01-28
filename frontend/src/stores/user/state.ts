import { create } from "zustand";
import { ObjectId } from "mongodb";

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
  following?: ObjectId[]; // will get from the db
  followers?: ObjectId[]; // will get from the db
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

export const createUserActions = (set: any): UserActions => ({
  setId: (id: string) => set((state: UserState) => ({ ...state, id })),

  setUsername: (username: string) =>
    set((state: UserState) => ({ ...state, username })),

  setEmail: (email: string) => set((state: UserState) => ({ ...state, email })),

  setAuthToken: (authToken: string | null) =>
    set((state: UserState) => ({ ...state, authToken })),

  setPreferences: (preferences: UserState["preferences"]) =>
    set((state: UserState) => ({ ...state, preferences })),

  setLocation: (location: UserState["location"]) =>
    set((state: UserState) => ({ ...state, location })),

  setUpdatedAt: (updatedAt: Date) =>
    set((state: UserState) => ({ ...state, updatedAt })),

  setRole: (role: UserState["role"]) =>
    set((state: UserState) => ({ ...state, role })),
});

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
  return create<UserStore>()((set) => ({
    ...initState,
    ...createUserActions(set),
  }));
};
