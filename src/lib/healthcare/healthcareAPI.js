import api from "../api";

export const getHealthCares = async (search = "") => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}institutions/healthcares`,
      { params: { search } }
    );
    return response.data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};
