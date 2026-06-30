import { toast } from "react-toastify";
import { dropUser } from "../lib/admin/users/usersAPI";
import { mutate } from "swr";

export const useUsers = () => {
  const deleteUser = async (id, token) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => dropUser(id, token)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            mutate(
              (key) => Array.isArray(key) && key[0] === "users",
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

  return { deleteUser };
};
