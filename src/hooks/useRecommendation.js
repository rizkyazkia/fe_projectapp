import { toast } from "react-toastify";
import { mutate } from "swr";
import {
  createRecommendation,
  changeStatusToProcessed,
} from "../lib/recommendationAPI";

export const useRecommendation = () => {
  const addRecommendation = async (data, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() =>
        createRecommendation(
          {
            ...data,
            healthCareId: data.selectedHealthCare,
          },
          token
        )
      ),
      {
        pending: "Membuat rekomendasi...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            mutate(
              (key) => Array.isArray(key) && key[0] === "students",
              undefined,
              { revalidate: true }
            );
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

  const changeStatusToProcessedRecommendation = async (id, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => changeStatusToProcessed(id, token)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            mutate(
              (key) => Array.isArray(key) && key[0] === "recommendations",
              undefined,
              { revalidate: true }
            );
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

  return { addRecommendation, changeStatusToProcessedRecommendation };
};
