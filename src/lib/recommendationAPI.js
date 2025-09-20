import axios from "axios";
import api from "./api";

export const getRecommendations = async (token) => {
  console.log({ token });
  try {
    if (!token) {
      return;
    }
    const response = await api.get(
      `${import.meta.env.VITE_API_GET_RECOMMENDATIONS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error.response?.data;
  }
};

export const createRecommendation = async (data, token) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_CREATE_RECOMMENDATION}`,
      data,
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

export const changeStatusToProcessed = async (id) => {
  try {
    const response = await api.patch(
      `${import.meta.env.VITE_API_CHANGE_TO_PROCESSED}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const createInternvetion = async (
  { recommendationId, forType, notes, content },
  token
) => {
  try {
    const response = await api.post(
      `${
        import.meta.env.VITE_API_CREATE_INTERVENTION
      }/${recommendationId}/interventions`,
      {
        forType,
        notes,
        content: JSON.stringify(content),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data;
  }
};

export const getSingleRecommendation = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}recommendation/single/${id}`
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    throw error.response?.data ?? error.message;
  }
};

export const getInterventionBelongsToInstitution = async (
  token,
  filter = {}
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}interventions/institutions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filter,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    throw error.response?.data ?? error.message;
  }
};

export const deleteIntervention = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}interventions/${id}`
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    throw error.response?.data ?? error.message;
  }
};

export const getInterventionBelongsToFamily = async (token, filter = {}) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}interventions/families`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filter,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    throw error.response?.data ?? error.message;
  }
};
