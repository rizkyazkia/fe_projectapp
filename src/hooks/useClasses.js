import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import { createClasses, dropClasses, putClasses } from "../lib/classesAPI";
import { useAuth } from "./auth/useAuth";
import { mutate } from "swr";

export const useClasses = () => {
  const { accessToken } = useAuth();

  const revalidateClasses = () => {
    mutate((key) => Array.isArray(key) && key[0] === "classes", undefined, {
      revalidate: true,
    });
  };

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
            revalidateClasses();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      },
    );
  };

  const updateClass = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => putClasses(id, data, accessToken)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-classes");
            revalidateClasses();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      },
    );
  };

  const deleteClass = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropClasses(id, accessToken)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            revalidateClasses();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      },
    );
  };

  return {
    addClass,
    updateClass,
    deleteClass,
  };
};
