import api from "./api";

export const getCities = async () => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_CITIES);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getCitiesByProvince = async (provinceId) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_BASE_URL}province/${provinceId}/cities`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const addProvince = async (province, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_BASE_URL}province`,
      { name: province },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const addCity = async (provinceId, newCity, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_BASE_URL}province/${provinceId}/cities`,
      { name: newCity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log({ response });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
