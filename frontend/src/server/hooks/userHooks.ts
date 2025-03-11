import { useQuery, useMutation } from "@tanstack/react-query";
import { UserApi } from "../api/userApi";
import { User } from "@/types/user";
import { USERS, FOLLOWERS, FOLLOWING } from "@/lib/constants/process";
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

export const useDeleteFollowing = (id: string) => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: () => UserApi.removeFollowing(id),
  });

  return {
    deleteFollowing: mutation.mutate,
    isLoadingDeleteFollowing: mutation.isPending,
    errorDeleteFollowing: mutation.error,
    isErrorDeleteFollowing: mutation.isError,
  };
};
