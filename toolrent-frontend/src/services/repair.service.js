import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/repairs/');
}

const create = data => {
    return httpClient.post("/api/v1/repairs/", data);
}

export default { getAll, create };
