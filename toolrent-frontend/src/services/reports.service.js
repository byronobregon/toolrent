import httpClient from "../http-common";

const getActiveLoans = () => {
  return httpClient.get("/api/v1/reports/active_loans");
};

const getClientsWithPenalties = () => {
  return httpClient.get("/api/v1/reports/clients_with_penalties");
};

const getMostLoanedTools = () => {
  return httpClient.get("/api/v1/reports/tools_most_loaned");
};

export default {
  getActiveLoans,
  getClientsWithPenalties,
  getMostLoanedTools,
};
