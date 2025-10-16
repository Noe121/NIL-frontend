const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load Terraform outputs for cloud configuration
function loadCloudConfig() {
  try {
    const tfOutputPath = path.resolve(__dirname, '../../NILbx-env/outputs.json');
    if (fs.existsSync(tfOutputPath)) {
      const tfOutputs = JSON.parse(fs.readFileSync(tfOutputPath, 'utf8'));
      return {
        API_URL: tfOutputs.api_url ? `https://${tfOutputs.api_url.value}/` : null,
        AUTH_SERVICE_URL: tfOutputs.auth_service_url ? tfOutputs.auth_service_url.value : null,
        FRONTEND_URL: tfOutputs.frontend_url ? tfOutputs.frontend_url.value : null,
        CLOUDFRONT_DOMAIN: tfOutputs.cloudfront_domain_name ? tfOutputs.cloudfront_domain_name.value : null,
        S3_BUCKET: tfOutputs.s3_bucket_name ? tfOutputs.s3_bucket_name.value : null,
        S3_WEBSITE: tfOutputs.s3_website_endpoint ? tfOutputs.s3_website_endpoint.value : null
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading Terraform outputs:', error.message);
    return null;
  }
}

async function testCloudConfiguration() {
  console.log('🌩️  Testing Frontend Cloud Configuration');
  console.log('=======================================');
  
  const cloudConfig = loadCloudConfig();
  
  if (!cloudConfig) {
    console.error('❌ Could not load Terraform outputs');
    process.exit(1);
  }
  
  console.log('📋 Cloud Configuration Loaded:');
  console.log(`   • API URL: ${cloudConfig.API_URL}`);
  console.log(`   • Auth Service: ${cloudConfig.AUTH_SERVICE_URL}`);
  console.log(`   • Frontend URL: ${cloudConfig.FRONTEND_URL}`);
  console.log(`   • CloudFront: ${cloudConfig.CLOUDFRONT_DOMAIN}`);
  console.log(`   • S3 Bucket: ${cloudConfig.S3_BUCKET}`);
  console.log(`   • S3 Website: ${cloudConfig.S3_WEBSITE}`);
  console.log('');

  let passed = 0;
  let total = 0;

  // Test 1: API URL accessibility
  total++;
  console.log('🔍 Test 1: Testing API URL accessibility...');
  try {
    if (cloudConfig.API_URL) {
      const response = await axios.get(cloudConfig.API_URL, {
        timeout: 10000,
        validateStatus: () => true // Accept any status
      });
      if (response.status < 500) {
        console.log(`✅ API URL is accessible (Status: ${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  API URL responded with status ${response.status}`);
      }
    } else {
      console.log('❌ No API URL configured');
    }
  } catch (error) {
    console.log(`❌ API URL test failed: ${error.message}`);
  }

  // Test 2: Auth Service URL validation
  total++;
  console.log('🔍 Test 2: Testing Auth Service URL...');
  if (cloudConfig.AUTH_SERVICE_URL && !cloudConfig.AUTH_SERVICE_URL.includes('<your-auth-service-dns-or-alb>')) {
    try {
      const response = await axios.get(cloudConfig.AUTH_SERVICE_URL.replace('/login', '/docs'), {
        timeout: 10000,
        validateStatus: () => true
      });
      if (response.status < 500) {
        console.log(`✅ Auth Service URL is accessible (Status: ${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  Auth Service responded with status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Auth Service test failed: ${error.message}`);
    }
  } else {
    console.log('⚠️  Auth Service URL is not properly configured (placeholder detected)');
  }

  // Test 3: Frontend URL accessibility
  total++;
  console.log('🔍 Test 3: Testing Frontend URL...');
  try {
    if (cloudConfig.FRONTEND_URL) {
      const response = await axios.get(cloudConfig.FRONTEND_URL, {
        timeout: 10000,
        validateStatus: () => true
      });
      if (response.status < 400) {
        console.log(`✅ Frontend URL is accessible (Status: ${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  Frontend URL responded with status ${response.status}`);
      }
    } else {
      console.log('❌ No Frontend URL configured');
    }
  } catch (error) {
    console.log(`❌ Frontend URL test failed: ${error.message}`);
  }

  // Test 4: CloudFront distribution
  total++;
  console.log('🔍 Test 4: Testing CloudFront distribution...');
  try {
    if (cloudConfig.CLOUDFRONT_DOMAIN) {
      const response = await axios.get(`https://${cloudConfig.CLOUDFRONT_DOMAIN}`, {
        timeout: 10000,
        validateStatus: () => true
      });
      if (response.status < 400) {
        console.log(`✅ CloudFront distribution is accessible (Status: ${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  CloudFront responded with status ${response.status}`);
      }
    } else {
      console.log('❌ No CloudFront domain configured');
    }
  } catch (error) {
    console.log(`❌ CloudFront test failed: ${error.message}`);
  }

  // Test 5: S3 website endpoint
  total++;
  console.log('🔍 Test 5: Testing S3 website endpoint...');
  try {
    if (cloudConfig.S3_WEBSITE) {
      const response = await axios.get(`http://${cloudConfig.S3_WEBSITE}`, {
        timeout: 10000,
        validateStatus: () => true
      });
      if (response.status < 400) {
        console.log(`✅ S3 website endpoint is accessible (Status: ${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  S3 website responded with status ${response.status}`);
      }
    } else {
      console.log('❌ No S3 website endpoint configured');
    }
  } catch (error) {
    console.log(`❌ S3 website test failed: ${error.message}`);
  }

  console.log('');
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Passed: ${passed}/${total} tests`);
  console.log(`❌ Failed: ${total - passed}/${total} tests`);
  
  if (passed === total) {
    console.log('');
    console.log('🎉 All cloud configuration tests passed!');
    console.log('✅ Your AWS infrastructure is properly configured and accessible');
    console.log('✅ Frontend can be deployed and integrated with cloud services');
  } else {
    console.log('');
    console.log('⚠️  Some tests failed or services are not fully configured');
    console.log('💡 This may be expected if some services are still being deployed');
  }

  // Test 6: Integration test with cloud endpoints
  console.log('');
  console.log('🔗 Testing Frontend Integration Pattern...');
  console.log('==========================================');
  
  // Show how the frontend test would work with cloud config
  console.log('📝 Frontend would use these endpoints:');
  console.log(`   • REACT_APP_API_URL: ${cloudConfig.API_URL}`);
  console.log(`   • AUTH_SERVICE_URL: ${cloudConfig.AUTH_SERVICE_URL}`);
  console.log(`   • Deployment URL: ${cloudConfig.FRONTEND_URL}`);
  console.log(`   • CDN URL: https://${cloudConfig.CLOUDFRONT_DOMAIN}`);

  console.log('');
  console.log('🚀 Next Steps for Cloud Testing:');
  console.log('1. Deploy frontend build to S3: npm run build');
  console.log('2. Update environment variables for production');
  console.log('3. Test end-to-end functionality with cloud endpoints');
  console.log('4. Verify CORS configuration for cross-origin requests');
  console.log('5. Test authentication flow with cloud auth service');
}

if (require.main === module) {
  testCloudConfiguration();
}
