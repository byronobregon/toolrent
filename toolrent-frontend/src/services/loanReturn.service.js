import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/loan_returns/');
}

const create = data => {
    return httpClient.post("/api/v1/loan_returns/", data);
}

export default { getAll, create };
