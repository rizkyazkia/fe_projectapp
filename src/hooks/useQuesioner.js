import { HSOverlay } from "preline/preline";
import { toast } from "react-toastify";
import { updateQuestion } from "../lib/quesionersAPI";
import { mutate } from "swr";

export const useQuesioner = () => {
  const updateQuesioner = async (id, data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => updateQuestion(id, data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-edit-question");
            mutate(
              (key) => Array.isArray(key) && key[0] === "questions",
              undefined,
              {
                revalidate: true,
              },
            );
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
    updateQuesioner,
  };
};
