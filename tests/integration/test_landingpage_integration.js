const axios = require('axios');


// Automatically register user and fetch JWT from auth-service
async function registerAndGetJWT() {
  const AUTH_SERVICE_REGISTER_URL = process.env.AUTH_SERVICE_REGISTER_URL || 'http://localhost:8001/register';
  const AUTH_SERVICE_LOGIN_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001/login';
  const USERNAME = process.env.TEST_USERNAME || 'testuser';
  const PASSWORD = process.env.TEST_PASSWORD || 'testpassword';
  const ROLE = process.env.TEST_ROLE || 'fan';
  try {
    // Register user (ignore errors if already exists)
    await axios.post(
      AUTH_SERVICE_REGISTER_URL,
      { username: USERNAME, password: PASSWORD, role: ROLE },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    // Ignore registration errors (user may already exist)
  }
  // Login to get JWT (form data)
  try {
    const params = new URLSearchParams();
    params.append('username', USERNAME);
    params.append('password', PASSWORD);
    const resp = await axios.post(
      AUTH_SERVICE_LOGIN_URL,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return 'Bearer ' + resp.data.access_token;
  } catch (err) {
    console.error('Failed to get JWT:', err);
    throw new Error('Failed to get JWT: ' + err.message);
  }
}


// Try to load cloud endpoints from Terraform outputs if available
let API_URL, AUTH_SERVICE_URL;
try {
  const fs = require('fs');
  // Load environment variables from test.env if present
  const envPath = require('path').resolve(__dirname, '../test.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2];
    });
  }
  // Set defaults from env or fallback
  API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/';
  AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001/login';
  // Only use Terraform outputs if outputs.json exists (i.e., infra is up)
  const tfOutputPath = require('path').resolve(__dirname, '../../NILbx-env/outputs.json');
  if (fs.existsSync(tfOutputPath)) {
    const tfOutputs = JSON.parse(fs.readFileSync(tfOutputPath, 'utf8'));
    if (tfOutputs.api_url) API_URL = tfOutputs.api_url.value;
    if (tfOutputs.auth_service_url) AUTH_SERVICE_URL = tfOutputs.auth_service_url.value;
  }
  // Always log which endpoints are being used
  console.log(`[INFO] Using API_URL: ${API_URL}`);
  console.log(`[INFO] Using AUTH_SERVICE_URL: ${AUTH_SERVICE_URL}`);
} catch (err) {
  // Ignore errors, fallback to local/docker URLs
  API_URL = 'http://localhost:8001/';
  AUTH_SERVICE_URL = 'http://localhost:8001/login';
  console.log(`[INFO] Using fallback API_URL: ${API_URL}`);
  console.log(`[INFO] Using fallback AUTH_SERVICE_URL: ${AUTH_SERVICE_URL}`);
}
// Hardcoded JWT for testing (replace with a valid token from your auth-service)
const TEST_JWT = 'Bearer <YOUR_VALID_JWT_HERE>';
const authHeaders = { headers: { Authorization: TEST_JWT } };

async function testLandingPageIntegration() {
  try {
    const jwt = await registerAndGetJWT();
    const authHeaders = { headers: { Authorization: jwt } };
    console.log('Using JWT for /athletes:', jwt);

    // Create an athlete first
    const uniqueEmail = `testathlete_${Date.now()}@example.com`;
    const athleteData = {
      email: uniqueEmail,
      name: 'Test Athlete',
      password: 'testpassword',
      sport: 'Soccer',
      bio: 'Test bio',
      social_media: {},
      profile_picture: '',
      stats: {},
      availability: null // ensure null is sent, not empty string
    };
    const createResp = await axios.post(`${API_URL}athletes`, athleteData, authHeaders);
    if (createResp.status !== 200) throw new Error('POST /athletes failed');
    console.log('[PASS] LandingPage POST /athletes integration');

    // Fetch athletes
    const athletesResp = await axios.get(`${API_URL}athletes`, authHeaders);
    if (athletesResp.status !== 200) throw new Error('GET /athletes failed');
    const athletes = athletesResp.data.athletes || athletesResp.data;
    if (!Array.isArray(athletes) || athletes.length === 0) throw new Error('No athletes returned');
    console.log('[PASS] LandingPage GET /athletes integration');
  } catch (err) {
    console.error('[FAIL] LandingPage integration:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

if (require.main === module) {
  testLandingPageIntegration();
}
