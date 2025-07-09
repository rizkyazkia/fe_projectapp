import { toast } from "react-toastify";
import {
  signIn,
  signOut,
  signUp,
  signUpInstitution,
} from "../../lib/auth/authAPI";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HSOverlay } from "preline/preline";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const useAuth = () => {
  const navigate = useNavigate();

  const { user, setUser, accessToken, setAccessToken, refreshToken } =
    useContext(AuthContext);

  const login = async (data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    let responseData = null;

    toast.promise(
      handleLoading.then(() => signIn(data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            const { data, message } = response.data;

            responseData = data;
            return message;
          },
          onClose: async () => {
            if (responseData && responseData.accessToken) {
              try {
                const decoded = jwtDecode(responseData.accessToken);

                const userRole = decoded.role;

                if (userRole === "admin") {
                  navigate("/admin");
                } else if (userRole === "school" || userRole === "teacher") {
                  navigate("/school");
                } else if (userRole === "parent") {
                  navigate("/parent");
                } else if (userRole === "healthcare" || userRole === "staff") {
                  navigate("/healthcare");
                } else {
                  navigate("/landing-page");
                }
              } catch (error) {
                console.error(error);
              }
            }
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

  const register = async (data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => signUp(data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            navigate("/auth/login");
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

  const registerInstitution = async (data) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => signUpInstitution(data)),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            HSOverlay.close("#modal-add-users");
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

  const logout = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => signOut()),
      {
        pending: "Loading...",
        success: {
          render(response) {
            return response.data.message;
          },
          onClose: () => {
            navigate("/");
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
    login,
    logout,
    register,
    registerInstitution,
    user,
    setUser,
    accessToken,
    setAccessToken,
    refreshToken,
  };
};
