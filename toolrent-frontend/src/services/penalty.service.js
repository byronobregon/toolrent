import httpClient from "../http-common";

const getPendingSummary = (clientRut) => {
  return httpClient.get(`/api/v1/penalties/clients/${clientRut}/pending-summary`);
};

const payPenalties = (clientRut) => {
  return httpClient.post(`/api/v1/penalties/clients/${clientRut}/pay`);
};

export default { getPendingSummary, payPenalties };
