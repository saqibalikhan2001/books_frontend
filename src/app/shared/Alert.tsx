/** @format */

import { ToastContainer, toast } from "react-toastify";
import { AlertProps, toastProps } from "./types";

const options = {
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const Container = () => (
  <ToastContainer
    draggable
    rtl={false}
    pauseOnHover
    closeOnClick
    autoClose={1000}
    // pauseOnFocusLoss
    newestOnTop={false}
    position="top-center"
    hideProgressBar={false}
  />
);

export const Toast = ({ message, position = "top-center", type = "success" }: toastProps) => {
  // Check if a toast is already displayed

  if (type === "success")
    return toast.success(message, {
      position,
      ...options,
    });
  else if (type === "info")
    return toast.info(message, {
      position,
      ...options,
    });
  return toast.error(message, {
    position,
    ...options,
  });
};

// for only one toast

// let toastDisplayed = false;
// export const Toast = ({ message, position = "top-center", type = "success" }: toastProps) => {
//   // if (toastDisplayed) return;

//   // toastDisplayed = true;
//   toast[type](message, {
//     position,
//     ...options,
//     onClose: () => {
//       // toastDisplayed = false;
//     },
//   });
// };

export const AlertBox = ({ message, type = "error" }: AlertProps) => Toast({ message, type });
