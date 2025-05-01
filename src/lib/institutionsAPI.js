import api from "./api";

export const getInstitutions = async (keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_INSTITUTIONS, {
      params: {
        search: keyword,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getInstitutionType = async () => {
  try {
    const response = await api.get(
      import.meta.env.VITE_API_GET_INSTITUTIONS_TYPE
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
