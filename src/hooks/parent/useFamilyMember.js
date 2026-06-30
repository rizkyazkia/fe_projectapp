import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import {
  dropFamilyMember,
  putFamilyMember,
} from "../../lib/parent/familiesAPI";

export const useFamilyMember = () => {
  const updateFamilyMember = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => putFamilyMember(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#modal-edit-family-member-${id}`);
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#modal-edit-family-member-${id}`);
            window.location.reload();
          },
        },
      }
    );
  };

  const deleteFamilyMember = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropFamilyMember(id)),
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
          onClose: () => {
            window.location.reload();
          },
        },
      }
    );
  };

  return {
    updateFamilyMember,
    deleteFamilyMember,
  };
};
