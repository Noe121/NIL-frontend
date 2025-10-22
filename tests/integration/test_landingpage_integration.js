const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load correct environment config based on mode
function loadEnvironmentConfig() {
  // Try loading from .env.test first
  let envPath = path.resolve(__dirname, '../../.env.test');
  if (!fs.existsSync(envPath)) {
    // Fallback to .env.standalone
    envPath = path.resolve(__dirname, '../../.env.standalone');
  }
  if (fs.existsSync(envPath)) {
    const envConfig = {};
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) envConfig[match[1]] = match[2];
    });
    return envConfig;
  }
  return null;
}

// Automatically register user and fetch JWT from auth-service
async function registerAndGetJWT() {
  const envConfig = loadEnvironmentConfig();
  const AUTH_SERVICE_URL = envConfig?.AUTH_SERVICE_URL || process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
  const REGISTER_URL = `${AUTH_SERVICE_URL}/register`;
  const LOGIN_URL = `${AUTH_SERVICE_URL}/login`;
  const USERNAME = process.env.TEST_USERNAME || 'testuser';
  const PASSWORD = process.env.TEST_PASSWORD || 'testpassword';
  const ROLE = process.env.TEST_ROLE || 'fan';
  try {
    // Register user (ignore errors if already exists)
    await axios.post(
      REGISTER_URL,
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
      LOGIN_URL,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return 'Bearer ' + resp.data.access_token;
  } catch (err) {
    console.error('Failed to get JWT:', err);
    throw new Error('Failed to get JWT: ' + err.message);
  }
}


// Get URLs from environment or Terraform outputs
function getApiUrls() {
  let API_URL, AUTH_SERVICE_URL;

  // Load environment config
  const envConfig = loadEnvironmentConfig();
  if (envConfig) {
    API_URL = envConfig.REACT_APP_API_URL;
    AUTH_SERVICE_URL = envConfig.AUTH_SERVICE_URL;
  }

  // Try to load from Terraform outputs if we're in centralized mode
  try {
    const tfOutputPath = path.resolve(__dirname, '../../infrastructure/outputs.json');
    if (fs.existsSync(tfOutputPath)) {
      const tfOutputs = JSON.parse(fs.readFileSync(tfOutputPath, 'utf8'));
      if (tfOutputs.api_url) API_URL = tfOutputs.api_url.value;
      if (tfOutputs.auth_service_url) AUTH_SERVICE_URL = tfOutputs.auth_service_url.value;
    }
  } catch (err) {
    // Ignore errors, use environment values
  }

  // Fallback to defaults
  API_URL = API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8001/';
  AUTH_SERVICE_URL = AUTH_SERVICE_URL || process.env.AUTH_SERVICE_URL || 'http://localhost:8001';

  console.log(`[INFO] Using API_URL: ${API_URL}`);
  console.log(`[INFO] Using AUTH_SERVICE_URL: ${AUTH_SERVICE_URL}`);

  return { API_URL, AUTH_SERVICE_URL };
}
// Hardcoded JWT for testing (replace with a valid token from your auth-service)
const TEST_JWT = 'Bearer <YOUR_VALID_JWT_HERE>';
const authHeaders = { headers: { Authorization: TEST_JWT } };

// Cleanup helper to remove test athletes
async function cleanupTestAthlete(jwt, email, apiUrl) {
  try {
    await axios.delete(`${apiUrl}athletes/${encodeURIComponent(email)}`, {
      headers: { Authorization: jwt }
    });
    console.log('[INFO] Cleaned up test athlete:', email);
  } catch (err) {
    console.warn('[WARN] Failed to cleanup test athlete:', email, err.message);
  }
}

// Test landing page functionality including athletes and early access form
async function testLandingPageIntegration() {
  const { API_URL } = getApiUrls();
  const testAthletes = [];
  let jwt;

  try {
    // Get JWT token
    jwt = await registerAndGetJWT();
    const authHeaders = { headers: { Authorization: jwt } };
    console.log('[INFO] Using JWT for tests:', jwt);

    // Test GET /athletes
    console.log('[TEST] Testing GET /athletes...');
    const getResp = await axios.get(`${API_URL}athletes`, authHeaders);
    if (getResp.status !== 200) throw new Error('GET /athletes failed');
    const initialAthletes = getResp.data.athletes || getResp.data;
    if (!Array.isArray(initialAthletes)) throw new Error('Invalid athletes response');
    console.log('[PASS] GET /athletes integration');

    // Test POST /athletes
    console.log('[TEST] Testing POST /athletes...');
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
      availability: null
    };
    const createResp = await axios.post(`${API_URL}athletes`, athleteData, authHeaders);
    if (createResp.status !== 200) throw new Error('POST /athletes failed');
    testAthletes.push(uniqueEmail);
    console.log('[PASS] POST /athletes integration');

    // Verify athlete was added
    console.log('[TEST] Verifying athlete creation...');
    const verifyResp = await axios.get(`${API_URL}athletes`, authHeaders);
    const updatedAthletes = verifyResp.data.athletes || verifyResp.data;
    if (updatedAthletes.length !== initialAthletes.length + 1) {
      throw new Error('Athlete count mismatch after creation');
    }
    console.log('[PASS] Athlete creation verification');

    // Test early access form submission
    console.log('[TEST] Testing early access form...');
    const formData = {
      name: 'Test User',
      email: `testuser_${Date.now()}@example.com`,
      role: 'fan'
    };
    const formResp = await axios.post(`${API_URL}early-access`, formData);
    if (formResp.status !== 200) throw new Error('Early access form submission failed');
    console.log('[PASS] Early access form integration');

    // Test role-based styling (by checking if the API returns role info)
    console.log('[TEST] Testing role endpoint...');
    const roleResp = await axios.get(`${API_URL}user/role`, authHeaders);
    if (roleResp.status !== 200 || !roleResp.data.role) {
      throw new Error('Role endpoint failed');
    }
    console.log('[PASS] Role endpoint integration');

    console.log('[SUCCESS] All landing page integration tests passed');
  } catch (err) {
    console.error('[FAIL] Landing page integration:', err.message);
    process.exit(1);
  } finally {
    // Cleanup test athletes
    if (jwt) {
      for (const email of testAthletes) {
        await cleanupTestAthlete(jwt, email, API_URL);
      }
    }
  }
  process.exit(0);
}

// Run tests if called directly
if (require.main === module) {
  testLandingPageIntegration();
}

module.exports = {
  testLandingPageIntegration,
  registerAndGetJWT,
  getApiUrls,
  cleanupTestAthlete
};
