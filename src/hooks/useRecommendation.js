import { toast } from "react-toastify";
import {
  createRecommendation,
  changeStatusToProcessed,
} from "../lib/recommendationAPI";

export const useRecommendation = (mutate) => {
  const addRecommendation = async (data, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);
    // toast.promise(

    //   handleLoading.then(() => createRecommendation(data, token)),
    //   {
    //     pending: "Loading...",
    //     success: {
    //       render(response) {
    //         setTimeout(() => {
    //           window.location.reload();
    //         }, 300);
    //         return response.data.message;
    //       },
    //     },
    //     error: {
    //       render(response) {
    //         return response.data.message;
    //       },
    //     },
    //     onSuccess: () => window.location.reload(),
    //   }
    // );
    try {
      const res = await createRecommendation(
        {
          ...data,
          healthCareId: data.selectedHealthCare,
        },
        token
      );

      toast.success("Rekomendasi berhasil dibuat", {
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (err) {
      console.log({ err });
      toast.error(`Gagal membuat rekomendasi: ${err.message}`);
    }
  };

  const changeStatusToProcessedRecommendation = async (id) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);
    toast.promise(
      handleLoading.then(() => changeStatusToProcessed(id)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            mutate("recommendations", { revalidate: true });
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
