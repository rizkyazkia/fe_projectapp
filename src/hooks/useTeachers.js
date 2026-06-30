import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import {
  createTeacher,
  dropTeacher,
  putTeacher,
} from "../lib/school/teachersAPI";
import { mutate } from "swr";

export const useTeachers = () => {
  const revalidateTeachers = () => {
    mutate((key) => Array.isArray(key) && key[0] === "teachers", undefined, {
      revalidate: true,
    });
  };

  const addTeacher = async (data, accessToken) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => createTeacher(data, accessToken)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
            revalidateTeachers();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
          },
        },
      },
    );
  };

  const updateTeacher = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => putTeacher(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
            revalidateTeachers();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
          },
        },
      },
    );
  };

  const deleteTeacher = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropTeacher(id)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
            revalidateTeachers();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-teachers");
          },
        },
      },
    );
  };

  return {
    addTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
