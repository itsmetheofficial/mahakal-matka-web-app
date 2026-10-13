import axios from "axios";
import { endSession } from "../utils/session";
const BASE_URL = "https://api.mahakalmatka.com/api";

const getAuthorizationToken = () => {
	let authToken = localStorage.getItem("authToken");
	if (authToken) {
		return `Bearer ${authToken}`;
	}
	return '';
}

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		Accept: 'application/json',
		Authorization: getAuthorizationToken(),
		request_type: 'web_app',
	},
});

apiClient.interceptors.request.use((config) => {
    config.headers.Authorization = getAuthorizationToken();
    return config;
});

const handleUnauthenticated = (response) => {
    const sentToken = response?.config?.headers?.Authorization;
    const currentToken = getAuthorizationToken();
    // Ignore responses from a previous session and let explicit logout finish its flow.
    if (currentToken && sentToken === currentToken && response.config.url !== '/logout'
        && (response.status === 401 || /^unauthenticated\.?$/i.test(response.data?.message || ''))) {
        endSession('Your session has expired. Please log in again.');
    }
};

apiClient.interceptors.response.use((response) => {
    handleUnauthenticated(response);
    return response;
}, (error) => {
    handleUnauthenticated(error.response);
    return Promise.reject(error);
});

export default apiClient; 