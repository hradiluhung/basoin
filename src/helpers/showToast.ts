import { WidgetTypes } from "@/constants/widgetTypes";
import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: WidgetTypes,
  theme?: string
) => {
  switch (type) {
    case WidgetTypes.SUCCESS:
      return toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    case WidgetTypes.INFO:
      return toast.info(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    case WidgetTypes.WARNING:
      return toast.warn(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    case WidgetTypes.ALERT:
      return toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    default:
      break;
  }
};
