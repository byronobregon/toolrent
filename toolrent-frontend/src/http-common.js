import axios from "axios";

const toolrentBackendServer = import.meta.env.VITE_BACKEND_SERVER_URL;
const toolrentBackendPort = import.meta.env.VITE_BACKEND_SERVER_PORT;

export default axios.create({
    baseURL: `http://${toolrentBackendServer}:${toolrentBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});