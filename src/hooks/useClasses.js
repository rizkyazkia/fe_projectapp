import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import { createClasses, dropClasses, putClasses } from "../lib/classesAPI";
import { useAuth } from "./auth/useAuth";

export const useClasses = () => {
  const { accessToken } = useAuth();
  const addClass = async (data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => createClasses(data, accessToken)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-classes");
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      }
    );
  };

  const updateClass = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => putClasses(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-classes");
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      }
    );
  };

  const deleteClass = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropClasses(id)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      }
    );
  };

  return {
    addClass,
    updateClass,
    deleteClass,
  };
};
