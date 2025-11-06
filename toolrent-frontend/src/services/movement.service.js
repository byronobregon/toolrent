import httpClient from "../http-common";

const getAll = (params = {}) => {
  return httpClient.get("/api/v1/movements/", { params });
};

const getByCategory = (categoryId, params = {}) => {
  return getAll({ ...params, categoryId });
};

export default { getAll, getByCategory };
