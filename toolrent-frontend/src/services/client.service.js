import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/clients/');
}

const getAvailable = () => {
    return httpClient.get('/api/v1/clients/available');
}

const create = data => {
    return httpClient.post("/api/v1/clients/", data);
}

const get = clientRut => {
    return httpClient.get(`/api/v1/clients/${clientRut}`);
}

const update = data => {
    return httpClient.put('/api/v1/clients/', data);
}

const remove = clientRut => {
    return httpClient.delete(`/api/v1/clients/${clientRut}`);
}
export default { getAll, getAvailable, create, get, update, remove };
