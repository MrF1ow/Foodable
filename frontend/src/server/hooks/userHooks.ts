import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";
import { User } from "@/types/user";

export const useFetchUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
  });
};

export const useCreateUser = () => {
  return useMutation<User, Error, User>({ mutationFn: createUser });
};

export const useUpdateUser = () => {
  return useMutation<User, Error, User>({ mutationFn: updateUser });
};

export const useDeleteUser = () => {
  return useMutation<void, Error, string>({ mutationFn: deleteUser });
};
