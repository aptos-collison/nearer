const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const controllers = require("./controllers.js");

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_NAMESPACE_ID = process.env.CLOUDFLARE_NAMESPACE_ID;

// Original routes
app.get("/", controllers.helloWorldCtrl);
app.post("/storeToIpfs", controllers.storeToIpfsCtrl);

// Reviews route with enhanced error handling
app.get('/api/reviews', async (_req, res) => {
  try {
    // Log the configuration (be careful not to log sensitive data in production)
    console.log('Making request to Cloudflare KV with:');
    console.log('Account ID:', CLOUDFLARE_ACCOUNT_ID?.slice(0, 5) + '...');
    console.log('Namespace ID:', CLOUDFLARE_NAMESPACE_ID?.slice(0, 5) + '...');
    
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_NAMESPACE_ID}/values/reviews`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data) {
      throw new Error('No data received from Cloudflare');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch reviews',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});