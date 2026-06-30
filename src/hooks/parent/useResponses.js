import { toast } from "react-toastify";
import { HSOverlay } from "preline/preline";
import {
  createResponseQuesionerInstitution,
  createResponseQuesioner,
  updateResponseQuesioner,
} from "../../lib/parent/responseAPI";

export const useResponses = () => {
  const addResponse = async (id, data, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => createResponseQuesioner(id, data, token)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#hs-vertically-centered-modal-${id}`);
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#hs-vertically-centered-modal-${id}`);
            window.location.reload();
          },
        },
      }
    );
  };

  const addResponseInstitution = async (id, data, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() =>
        createResponseQuesionerInstitution(id, data, token)
      ),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#hs-vertically-centered-modal-${id}`);
            window.location.reload();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#hs-vertically-centered-modal-${id}`);
            // window.location.reload();
          },
        },
      }
    );
  };

  const updateResponse = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => updateResponseQuesioner(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close(`#hs-edit-response-modal-${id}`);
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

  return { addResponse, addResponseInstitution, updateResponse };
};
