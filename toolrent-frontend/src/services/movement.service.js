import httpClient from "../http-common";

const getAll = (params = {}) => {
  return httpClient.get("/api/v1/movements/", { params });
};

const getByCategory = (categoryId, params = {}) => {
  return httpClient.get(`/api/v1/movements/category/${categoryId}`, {
    params,
  });
};

export default { getAll, getByCategory };
