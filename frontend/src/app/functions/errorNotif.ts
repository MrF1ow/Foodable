import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import { CustomError } from "@/types/error";

export const errorNotification = (
  isError: boolean,
  title: string,
  error: CustomError | null = null
) => {
  if (isError && error) {
    showToast(
      TOAST_SEVERITY.ERROR,
      `${error.status}: ${title}`,
      error.message,
      5000
    );
  }
};
