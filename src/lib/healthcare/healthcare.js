import api from "../api";

export const getHealthCares = async () => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}institutions/healthcares`
    );
    const data = response.data;

    return data;
  } catch (err) {
    console.log({ err });
    throw err?.response?.data ?? err.message;
  }
};
