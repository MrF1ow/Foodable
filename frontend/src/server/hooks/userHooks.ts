import { useQuery, useMutation } from "@tanstack/react-query";
import { UserApi } from "../api/userApi";
import { User } from "@/types/user";

export const useFetchUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.fetchUserById(id),
  });
};

export const useCreateUser = () => {
  return useMutation<User, Error, User>({ mutationFn: UserApi.createUser });
};

export const useUpdateUser = () => {
  return useMutation<User, Error, User>({ mutationFn: UserApi.updateUser });
};

export const useDeleteUser = () => {
  return useMutation<void, Error, string>({ mutationFn: UserApi.deleteUser });
};
