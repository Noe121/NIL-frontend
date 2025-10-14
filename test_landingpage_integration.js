const axios = require('axios');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

async function testLandingPageIntegration() {
  try {
    // Fetch athletes
    const athletesResp = await axios.get(`${API_URL}athletes`);
    if (athletesResp.status !== 200) throw new Error('GET /athletes failed');
    const athletes = athletesResp.data.athletes || athletesResp.data;
    if (!Array.isArray(athletes) || athletes.length === 0) throw new Error('No athletes returned');
    console.log('[PASS] LandingPage GET /athletes integration');

    // Submit early access form
    const formData = { name: 'Test User', email: 'testuser@example.com', role: 'fan', sport: 'fan' };
    const submitResp = await axios.post(`${API_URL}athletes`, formData);
    if (submitResp.status !== 200) throw new Error('POST /athletes failed');
    console.log('[PASS] LandingPage POST /athletes integration');
  } catch (err) {
    console.error('[FAIL] LandingPage integration:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

if (require.main === module) {
  testLandingPageIntegration();
}
