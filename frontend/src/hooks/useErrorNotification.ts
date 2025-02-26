import { useEffect } from "react";
import { errorNotification } from "@/app/functions/notifications";
import { CustomError } from "@/types/error";

export const useErrorNotification = (
  isError: boolean,
  title: string,
  error: CustomError | null = null
) => {
  useEffect(() => {
    errorNotification(isError, title, error);
  }, [isError, title, error]);
};
