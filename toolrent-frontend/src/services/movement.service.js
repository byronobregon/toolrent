import httpClient from "../http-common";

const getAll = () => {
  return httpClient.get("/api/v1/movements/");
};

const getByCategory = (categoryId) => {
  return httpClient.get(`/api/v1/movements/category/${categoryId}`);
};

export default { getAll, getByCategory };
