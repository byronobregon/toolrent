import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/loans/');
}

const create = data => {
    return httpClient.post("/api/v1/loans/", data);
}

const get = id => {
    return httpClient.get(`/api/v1/loans/${id}`);
}

const update = id => { }

const remove = id => { }

export default { getAll, create, get, update, remove };
