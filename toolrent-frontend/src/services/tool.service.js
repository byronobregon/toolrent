import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/tools/');
}

const getAvailable = () => {
    return httpClient.get('/api/v1/tools/available');
}

const create = data => {
    return httpClient.post("/api/v1/tools/", data);
}

const get = id => {
    return httpClient.get(`/api/v1/tools/${id}`);
}

const update = data => {
    return httpClient.put('/api/v1/tools/', data);
}

const remove = id => {
    return httpClient.delete(`/api/v1/tools/${id}`);
}
export default { getAll, getAvailable, create, get, update, remove };
