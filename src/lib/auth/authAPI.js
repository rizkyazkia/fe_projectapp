import api from "../api";

export const signIn = async (data) => {
  try {
    const response = await api.post(import.meta.env.VITE_API_LOGIN, data);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const signUp = async (data) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_REGISTER_PARENT,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const signUpInstitution = async (data) => {
  try {
    const response = await api.post(
      import.meta.env.VITE_API_REGISTER_INSTITUTION,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data;
  }
};

export const signOut = async () => {
  try {
    const response = await api.delete(import.meta.env.VITE_API_LOGOUT);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const token = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_REFRESH_TOKEN);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
