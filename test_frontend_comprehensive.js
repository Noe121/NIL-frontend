#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Frontend Application');
console.log('===============================');

const FRONTEND_URL = 'http://localhost:5173';
const TEST_RESULTS = [];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testFrontendResponsiveness() {
    console.log('\n1. 🌐 Testing Frontend Server Responsiveness...');
    try {
        const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
        
        if (response.status === 200) {
            console.log('   ✅ Frontend server is responding');
            console.log(`   📊 Response time: ${response.headers['x-response-time'] || 'N/A'}`);
            console.log(`   📄 Content type: ${response.headers['content-type']}`);
            TEST_RESULTS.push({ test: 'Server Responsiveness', status: 'PASS' });
            return true;
        } else {
            console.log(`   ❌ Unexpected status code: ${response.status}`);
            TEST_RESULTS.push({ test: 'Server Responsiveness', status: 'FAIL', error: `Status: ${response.status}` });
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Frontend server not accessible: ${error.message}`);
        TEST_RESULTS.push({ test: 'Server Responsiveness', status: 'FAIL', error: error.message });
        return false;
    }
}

async function testHTMLStructure() {
    console.log('\n2. 🏗️ Testing HTML Structure...');
    try {
        const response = await axios.get(FRONTEND_URL);
        const html = response.data;
        
        // Check for essential HTML elements
        const checks = [
            { name: 'HTML DOCTYPE', regex: /<!DOCTYPE html>/i },
            { name: 'HTML tag', regex: /<html[^>]*>/i },
            { name: 'Head section', regex: /<head[^>]*>/i },
            { name: 'Body section', regex: /<body[^>]*>/i },
            { name: 'Meta viewport', regex: /<meta[^>]*viewport[^>]*>/i },
            { name: 'Title tag', regex: /<title[^>]*>.*<\/title>/i },
            { name: 'React root div', regex: /<div[^>]*id=["']root["'][^>]*>/i }
        ];
        
        let passedChecks = 0;
        checks.forEach(check => {
            if (check.regex.test(html)) {
                console.log(`   ✅ ${check.name} found`);
                passedChecks++;
            } else {
                console.log(`   ❌ ${check.name} missing`);
            }
        });
        
        const success = passedChecks === checks.length;
        TEST_RESULTS.push({ 
            test: 'HTML Structure', 
            status: success ? 'PASS' : 'PARTIAL',
            details: `${passedChecks}/${checks.length} checks passed`
        });
        
        return success;
    } catch (error) {
        console.log(`   ❌ HTML structure test failed: ${error.message}`);
        TEST_RESULTS.push({ test: 'HTML Structure', status: 'FAIL', error: error.message });
        return false;
    }
}

async function testStaticAssets() {
    console.log('\n3. 📁 Testing Static Assets...');
    try {
        const response = await axios.get(FRONTEND_URL);
        const html = response.data;
        
        // Extract script and CSS references from HTML
        const scriptMatches = html.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
        const cssMatches = html.match(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi) || [];
        
        let assetsChecked = 0;
        let assetsFound = 0;
        
        // Test script assets
        for (const scriptMatch of scriptMatches) {
            const srcMatch = scriptMatch.match(/src=["']([^"']+)["']/);
            if (srcMatch && srcMatch[1]) {
                const assetUrl = srcMatch[1].startsWith('http') ? srcMatch[1] : `${FRONTEND_URL}${srcMatch[1]}`;
                try {
                    const assetResponse = await axios.head(assetUrl, { timeout: 3000 });
                    if (assetResponse.status === 200) {
                        console.log(`   ✅ Script asset: ${srcMatch[1]}`);
                        assetsFound++;
                    } else {
                        console.log(`   ❌ Script asset not found: ${srcMatch[1]}`);
                    }
                } catch (error) {
                    console.log(`   ❌ Script asset error: ${srcMatch[1]} - ${error.message}`);
                }
                assetsChecked++;
            }
        }
        
        // Test CSS assets
        for (const cssMatch of cssMatches) {
            const hrefMatch = cssMatch.match(/href=["']([^"']+)["']/);
            if (hrefMatch && hrefMatch[1]) {
                const assetUrl = hrefMatch[1].startsWith('http') ? hrefMatch[1] : `${FRONTEND_URL}${hrefMatch[1]}`;
                try {
                    const assetResponse = await axios.head(assetUrl, { timeout: 3000 });
                    if (assetResponse.status === 200) {
                        console.log(`   ✅ CSS asset: ${hrefMatch[1]}`);
                        assetsFound++;
                    } else {
                        console.log(`   ❌ CSS asset not found: ${hrefMatch[1]}`);
                    }
                } catch (error) {
                    console.log(`   ❌ CSS asset error: ${hrefMatch[1]} - ${error.message}`);
                }
                assetsChecked++;
            }
        }
        
        if (assetsChecked === 0) {
            console.log('   ℹ️ No external assets found to test');
            TEST_RESULTS.push({ test: 'Static Assets', status: 'SKIP', details: 'No assets found' });
            return true;
        }
        
        const success = assetsFound === assetsChecked;
        console.log(`   📊 Assets loaded: ${assetsFound}/${assetsChecked}`);
        TEST_RESULTS.push({ 
            test: 'Static Assets', 
            status: success ? 'PASS' : 'PARTIAL',
            details: `${assetsFound}/${assetsChecked} assets loaded`
        });
        
        return success;
    } catch (error) {
        console.log(`   ❌ Static assets test failed: ${error.message}`);
        TEST_RESULTS.push({ test: 'Static Assets', status: 'FAIL', error: error.message });
        return false;
    }
}

async function testBuildOutput() {
    console.log('\n4. 🔧 Testing Build Output...');
    try {
        const distPath = path.join(__dirname, '..', 'dist');
        
        if (!fs.existsSync(distPath)) {
            console.log('   ❌ Dist directory not found');
            TEST_RESULTS.push({ test: 'Build Output', status: 'FAIL', error: 'Dist directory missing' });
            return false;
        }
        
        const distFiles = fs.readdirSync(distPath);
        console.log(`   📁 Dist directory contains ${distFiles.length} files`);
        
        const expectedFiles = ['index.html', 'assets'];
        let foundFiles = 0;
        
        expectedFiles.forEach(expectedFile => {
            if (distFiles.includes(expectedFile)) {
                console.log(`   ✅ Found: ${expectedFile}`);
                foundFiles++;
            } else {
                console.log(`   ❌ Missing: ${expectedFile}`);
            }
        });
        
        // Check assets directory
        const assetsPath = path.join(distPath, 'assets');
        if (fs.existsSync(assetsPath)) {
            const assetFiles = fs.readdirSync(assetsPath);
            console.log(`   📦 Assets directory contains ${assetFiles.length} files`);
            
            const hasJS = assetFiles.some(file => file.endsWith('.js'));
            const hasCSS = assetFiles.some(file => file.endsWith('.css'));
            
            if (hasJS) console.log('   ✅ JavaScript bundle found');
            else console.log('   ❌ JavaScript bundle missing');
            
            if (hasCSS) console.log('   ✅ CSS bundle found');
            else console.log('   ❌ CSS bundle missing');
        }
        
        const success = foundFiles === expectedFiles.length;
        TEST_RESULTS.push({ 
            test: 'Build Output', 
            status: success ? 'PASS' : 'PARTIAL',
            details: `${foundFiles}/${expectedFiles.length} expected files found`
        });
        
        return success;
    } catch (error) {
        console.log(`   ❌ Build output test failed: ${error.message}`);
        TEST_RESULTS.push({ test: 'Build Output', status: 'FAIL', error: error.message });
        return false;
    }
}

async function testAPIConnectivity() {
    console.log('\n5. 🔗 Testing API Connectivity...');
    try {
        // Test connection to our backend services
        const services = [
            { name: 'Auth Service', url: 'http://localhost:8000/health' },
            { name: 'API Service', url: 'http://localhost:8001/health' },
            { name: 'Company API', url: 'http://localhost:8002/health' }
        ];
        
        let servicesUp = 0;
        
        for (const service of services) {
            try {
                const response = await axios.get(service.url, { timeout: 2000 });
                if (response.status === 200) {
                    console.log(`   ✅ ${service.name}: Connected`);
                    servicesUp++;
                } else {
                    console.log(`   ❌ ${service.name}: Status ${response.status}`);
                }
            } catch (error) {
                console.log(`   ⚠️ ${service.name}: Not running (${error.message})`);
            }
        }
        
        console.log(`   📊 Services available: ${servicesUp}/${services.length}`);
        TEST_RESULTS.push({ 
            test: 'API Connectivity', 
            status: servicesUp > 0 ? 'PASS' : 'FAIL',
            details: `${servicesUp}/${services.length} services available`
        });
        
        return servicesUp > 0;
    } catch (error) {
        console.log(`   ❌ API connectivity test failed: ${error.message}`);
        TEST_RESULTS.push({ test: 'API Connectivity', status: 'FAIL', error: error.message });
        return false;
    }
}

async function generateTestReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🏆 FRONTEND TEST RESULTS');
    console.log('='.repeat(60));
    
    let totalTests = TEST_RESULTS.length;
    let passedTests = TEST_RESULTS.filter(r => r.status === 'PASS').length;
    let partialTests = TEST_RESULTS.filter(r => r.status === 'PARTIAL').length;
    let failedTests = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
    let skippedTests = TEST_RESULTS.filter(r => r.status === 'SKIP').length;
    
    TEST_RESULTS.forEach((result, index) => {
        const statusIcon = {
            'PASS': '✅',
            'PARTIAL': '⚠️',
            'FAIL': '❌',
            'SKIP': 'ℹ️'
        }[result.status];
        
        console.log(`${index + 1}. ${statusIcon} ${result.test}: ${result.status}`);
        if (result.details) console.log(`   📝 ${result.details}`);
        if (result.error) console.log(`   ⚠️ ${result.error}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
    console.log(`✅ Passed: ${passedTests}`);
    if (partialTests > 0) console.log(`⚠️ Partial: ${partialTests}`);
    if (failedTests > 0) console.log(`❌ Failed: ${failedTests}`);
    if (skippedTests > 0) console.log(`ℹ️ Skipped: ${skippedTests}`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All frontend tests passed! Frontend is ready for production.');
        console.log('🚀 React + Vite application is working correctly');
        console.log('🌐 Dev server running on http://localhost:5173/');
        console.log('📦 Build output is properly generated');
    } else if (passedTests + partialTests === totalTests) {
        console.log('\n⚠️ Frontend tests passed with some warnings.');
        console.log('🔧 Consider addressing partial test results for optimal performance.');
    } else {
        console.log('\n❌ Some frontend tests failed.');
        console.log('🔍 Review failed tests and address issues before deployment.');
    }
    
    return passedTests === totalTests;
}

async function main() {
    console.log('⏳ Waiting for frontend server to be ready...');
    await sleep(2000);
    
    const tests = [
        testFrontendResponsiveness,
        testHTMLStructure,
        testStaticAssets,
        testBuildOutput,
        testAPIConnectivity
    ];
    
    for (const test of tests) {
        await test();
        await sleep(500); // Small delay between tests
    }
    
    const allPassed = await generateTestReport();
    process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}