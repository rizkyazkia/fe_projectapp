import api from "../api";

export const getStudents = async (keyword, page, limit) => {
  try {
    const response = await api.get(import.meta.env.VITE_API_GET_STUDENTS, {
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

export const getStudentsByInstitution = async (
  token,
  keyword,
  page,
  limit,
  filteredClass = ""
) => {
  try {
    const response = await api.get(
      import.meta.env.VITE_API_GET_STUDENTS_BY_INSTITUTION,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(keyword && {
            search: keyword,
          }),
          page,
          limit,
          ...(filteredClass && {
            class: filteredClass,
          }),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error.response?.data;
  }
};
