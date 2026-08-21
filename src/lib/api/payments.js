import { apiRequest } from "./client";

export const getMyPayments = (token) => apiRequest("GET", "/payments/my", null, token);
export const createCheckoutSession = (plan, role, token) => apiRequest("POST", "/payments/create-checkout-session", { plan, role }, token);
export const confirmPayment = (sessionId, plan, token) => apiRequest("POST", "/payments/confirm", { sessionId, plan }, token);
