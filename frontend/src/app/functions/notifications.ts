import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/app/providers";
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

export const successNotification = (title: string, message: string) => {
  showToast(TOAST_SEVERITY.SUCCESS, title, message, 5000);
};

export const infoNotification = (title: string, message: string) => {
  showToast(TOAST_SEVERITY.INFO, title, message, 5000);
};

export const warnNotification = (title: string, message: string) => {
  showToast(TOAST_SEVERITY.WARN, title, message, 5000);
};

export const secondaryNotification = (title: string, message: string) => {
  showToast(TOAST_SEVERITY.SECONDARY, title, message, 5000);
};

export const contrastNotification = (title: string, message: string) => {
  showToast(TOAST_SEVERITY.CONTRAST, title, message, 5000);
};
