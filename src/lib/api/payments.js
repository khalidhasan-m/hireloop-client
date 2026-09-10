import { apiRequest } from "./client";

export const getMyPayments = (token) =>
  apiRequest("GET", "/payments/my", null, token);

// Safely normalizes plan and role before sending to the Express backend
export const createPaymentIntent = async (plan, role, token) => {
  try {
    return await apiRequest(
      "POST",
      "/payments/create-payment-intent",
      { 
        plan: plan ? String(plan).toUpperCase() : undefined, 
        role: role ? String(role).toLowerCase() : "seeker" 
      },
      token,
    );
  } catch (error) {
    // Provide more helpful error for missing backend endpoint
    if (error.message?.includes("404") || error.message?.includes("Not Found")) {
      throw new Error(
        "Payment endpoint not found. Please ensure the backend server is running with the payments routes implemented."
      );
    }
    throw error;
  }
};

export const confirmPayment = (sessionId, plan, token) =>
  apiRequest("POST", "/payments/confirm", { sessionId, plan }, token);

export const getSubscription = (token) =>
  apiRequest("GET", "/payments/subscription", null, token);

export const changePlan = (plan, token) =>
  apiRequest("POST", "/payments/change-plan", { plan }, token);

export const cancelSubscription = (token) =>
  apiRequest("POST", "/payments/cancel", {}, token);