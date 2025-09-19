import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/clients/');
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
export default { getAll, create, get, update, remove };
