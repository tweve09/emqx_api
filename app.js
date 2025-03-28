require("dotenv").config();
const base64 = require("base-64");
const axios = require("axios");

// EMQX cloud credentials
const APP_ID = process.env.APP_ID;
const APP_SECRETE = process.env.APP_SECRETE;

// create basic auth taken
function getAuthHeader() {
  const encoded = base64.encode(`${APP_ID}:${APP_SECRETE}`);
  return { Authorization: `Basic ${encoded}` };
}

// EMQX cloud API URL
const EMQX_API_URL = process.env.EMQX_API_URL;

// List all connected clients
async function listConnectedClients() {
  try {
    const response = await axios.get(`${EMQX_API_URL}/clients`, {
      headers: getAuthHeader(),
      params: {
        page: 1,
        limit: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching connected clients:", error);
    throw error;
  }
}

async function getClientDetails(clientId) {
  try {
    const response = await axios.get(`${EMQX_API_URL}/clients/${clientId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting client details:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function publishMessage(topic, payload, qos = 0, retain = false) {
  try {
    const response = await axios.post(
      `${EMQX_API_URL}/mqtt/publish`,
      {
        topic,
        payload,
        qos,
        retain,
      },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error publishing message:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function disconnectClient(clientId) {
  try {
    const response = await axios.delete(`${EMQX_API_URL}/clients/${clientId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error disconnecting client:",
      error.response?.data || error.message
    );
    throw error;
  }
}

listConnectedClients()
  .then((clients) => {
    console.log("Connected clients:", clients);
  })
  .catch((error) => {
    console.error("Failed to fetch clients:", error);
  });
