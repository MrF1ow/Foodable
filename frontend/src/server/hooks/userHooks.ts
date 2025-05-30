import { useQuery, useMutation } from "@tanstack/react-query";
import { UserApi } from "../api/userApi";
import { FollowMetadata, User, UserPreferences, UserSettings } from "@/types/user";
import {
  USERS,
  CURRENT_LIST,
  FOLLOWERS,
  FOLLOWING,
  SETTINGS,
  PREFERENCES,
  IMAGES,
  SELF,
  ITEMS
} from "@/lib/constants/process";
import { useQueryProps } from "@/types";

export const useFetchUserById = ({
  id,
  enabled = true,
}: useQueryProps & { id: string }) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    error: errorUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: [USERS, id],
    queryFn: () => UserApi.fetchUserById(id),
    retry: 2,
    enabled,
  });
  return {
    user,
    isLoadingUser,
    refetchUser,
    errorUser,
    isErrorUser,
  };
};

export const useCreateUser = () => {
  const mutation = useMutation<User, Error, User>({
    mutationFn: UserApi.createUser,
  });

  return {
    createUser: mutation.mutateAsync,
    isLoadingCreateUser: mutation.isPending,
    errorCreateUser: mutation.error,
    isErrorCreateUser: mutation.isError,
  };
};

export const useUpdateUser = () => {
  const mutation = useMutation<User, Error, User>({
    mutationFn: UserApi.updateUser,
  });

  return {
    updateUser: mutation.mutateAsync,
    isLoadingUpdateUser: mutation.isPending,
    errorUpdateUser: mutation.error,
    isErrorUpdateUser: mutation.isError,
  };
};

export const useDeleteUser = () => {
  const mutation = useMutation<User, Error, string>({
    mutationFn: UserApi.deleteUser,
  });

  return {
    deleteUser: mutation.mutate,
    isLoadingDeleteUser: mutation.isPending,
    errorDeleteUser: mutation.error,
    isErrorDeleteUser: mutation.isError,
  };
};

export const useFetchAllFollowersOfUser = ({
  enabled = true,
}: useQueryProps) => {
  const {
    data: followers,
    isLoading: isLoadingFollowers,
    refetch: refetchFollowers,
    error: errorFollowers,
    isError: isErrorFollowers,
  } = useQuery({
    queryKey: [USERS, FOLLOWERS],
    queryFn: UserApi.fetchAllFollowersOfUser,
    retry: 2,
    enabled,
  });

  return {
    followers,
    isLoadingFollowers,
    refetchFollowers,
    errorFollowers,
    isErrorFollowers,
  };
};

export const useFetchAllFollowingOfUser = ({
  enabled = true,
}: useQueryProps) => {
  const {
    data: following,
    isLoading: isLoadingFollowing,
    refetch: refetchFollowing,
    error: errorFollowing,
    isError: isErrorFollowing,
  } = useQuery({
    queryKey: [USERS, FOLLOWING],
    queryFn: UserApi.fetchAllFollowingOfUser,
    retry: 2,
    enabled,
  });

  return {
    following,
    isLoadingFollowing,
    refetchFollowing,
    errorFollowing,
    isErrorFollowing,
  };
};

export const useDeleteFollowing = () => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => UserApi.removeFollowing(id),
  });

  return {
    deleteFollowing: mutation.mutateAsync,
    isLoadingDeleteFollowing: mutation.isPending,
    errorDeleteFollowing: mutation.error,
    isErrorDeleteFollowing: mutation.isError,
  };
};

export const useFollowUser = () => {
  const mutation = useMutation<string, Error, FollowMetadata>({
    mutationFn: (follow: FollowMetadata) => UserApi.followUser(follow),
  });

  return {
    followUser: mutation.mutate,
    isLoadingFollowUser: mutation.isPending,
    errorFollowUser: mutation.error,
    isErrorFollowUser: mutation.isError
  };
};

export const useFetchUserSettings = ({ enabled = true }: useQueryProps) => {
  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
    error: errorSettings,
    isError: isErrorSettings,
  } = useQuery({
    queryKey: [USERS, SETTINGS],
    queryFn: UserApi.fetchUserSettings,
    retry: 2,
    enabled,
  });

  return {
    settings,
    isLoadingSettings,
    refetchSettings,
    errorSettings,
    isErrorSettings,
  };
};

export const useUpdateUserSettings = () => {
  const mutation = useMutation<UserSettings, Error, UserSettings>({
    mutationFn: UserApi.updateUserSettings,
  });

  return {
    updateUserSettings: mutation.mutateAsync,
    isLoadingUpdateSettings: mutation.isPending,
    errorUpdateSettings: mutation.error,
    isErrorUpdateSettings: mutation.isError,
  };
};

export const useFetchUserPreferences = ({ enabled = true }: useQueryProps) => {
  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    refetch: refetchPreferences,
    error: errorPreferences,
    isError: isErrorPreferences,
  } = useQuery({
    queryKey: [USERS, PREFERENCES],
    queryFn: UserApi.fetchUserPreferences,
    retry: 2,
    enabled,
  });

  return {
    preferences,
    isLoadingPreferences,
    refetchPreferences,
    errorPreferences,
    isErrorPreferences,
  };
};

export const useUpdateUserPreferences = () => {
  const mutation = useMutation<UserPreferences, Error, UserPreferences>({
    mutationFn: UserApi.updateUserPreferences,
  });

  return {
    updateUserPreferences: mutation.mutateAsync,
    isLoadingUpdatePreferences: mutation.isPending,
    errorUpdatePreferences: mutation.error,
    isErrorUpdatePreferences: mutation.isError,
  };
};

export const useFetchUserCurrentList = ({ enabled = true }: useQueryProps) => {
  const {
    data: currentGroceryListId,
    isLoading: isLoadingCurrentListId,
    refetch: refetchCurrentListId,
    error: errorCurrentListId,
    isError: isErrorCurrentListId,
  } = useQuery({
    queryKey: [USERS, CURRENT_LIST],
    queryFn: UserApi.fetchUserCurrentList,
    retry: 2,
    enabled,
  });

  return {
    currentGroceryListId,
    isLoadingCurrentListId,
    refetchCurrentListId,
    errorCurrentListId,
    isErrorCurrentListId,
  };
};

export const useUpdateUserCurrentList = () => {
  const mutation = useMutation<User, Error, string>({
    mutationFn: UserApi.updateUserCurrentList,
  });

  return {
    updateUserCurrentList: mutation.mutateAsync,
    isLoadingUpdateCurrentList: mutation.isPending,
    errorUpdateCurrentList: mutation.error,
    isErrorUpdateCurrentList: mutation.isError,
  };
};

export const useFetchUserBannerId = ({ enabled = true }: useQueryProps) => {
  const {
    data: bannerId,
    isLoading: isLoadingBannerId,
    refetch: refetchBannerId,
    error: errorBannerId,
    isError: isErrorBannerId,
  } = useQuery({
    queryKey: [USERS, IMAGES],
    queryFn: UserApi.fetchSignInUserBannerId,
    retry: 2,
    enabled
  })

  return {
    bannerId, isLoadingBannerId, refetchBannerId, errorBannerId, isErrorBannerId
  }
}

export const useUpdateUserBannerId = () => {
  const mutation = useMutation<string, Error, string>({
    mutationFn: (bannerId: string) => UserApi.updateSignInUserBannerId(bannerId)
  })

  return {
    updateBannerId: mutation.mutateAsync,
    isLoadingUpdateBannerId: mutation.isPending,
    errorUpdateBannerid: mutation.error,
    isErrorUpdateBannerId: mutation.isError
  }
}

export const useFetchSelf = ({ enabled = true }: useQueryProps) => {
  const {
    data: userProfile,
    isLoading: isLoadingSelf,
    refetch: refetchSelf,
    error: errorSelf,
    isError: isErrorSelf,
  } = useQuery({
    queryKey: [USERS, SELF],
    queryFn: UserApi.fetchSelf,
    retry: 2,
    enabled,
  });

  return {
    userProfile,
    isLoadingSelf,
    refetchSelf,
    errorSelf,
    isErrorSelf,
  };
};

export const useFetchCreatedItems = ({ enabled = true }: useQueryProps) => {
  const {
    data: createdItems,
    isLoading: isLoadingCreatedItems,
    refetch: refetchCreatedItems,
    error: errorCreatedItems,
    isError: isErrorCreatedItems
  } = useQuery({
    queryKey: [USERS, ITEMS],
    queryFn: UserApi.fetchCreatedItems,
    retry: 2,
    enabled,
  });

  return {
    createdItems,
    isLoadingCreatedItems,
    refetchCreatedItems,
    errorCreatedItems,
    isErrorCreatedItems
  }
};
