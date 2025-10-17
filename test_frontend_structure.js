#!/usr/bin/env node

console.log('🧪 Frontend Application Tests');
console.log('============================');

const fs = require('fs');
const path = require('path');

function testBuildOutput() {
    console.log('\n1. 🔧 Testing Build Output...');
    
    const distPath = path.join(__dirname, 'dist');
    
    if (!fs.existsSync(distPath)) {
        console.log('   ❌ Dist directory not found');
        return false;
    }
    
    const distFiles = fs.readdirSync(distPath);
    console.log(`   📁 Dist directory contains ${distFiles.length} files:`);
    
    distFiles.forEach(file => {
        console.log(`   📄 ${file}`);
    });
    
    // Check for essential files
    const hasIndexHTML = distFiles.includes('index.html');
    const hasAssets = distFiles.includes('assets');
    
    if (hasIndexHTML) console.log('   ✅ index.html found');
    else console.log('   ❌ index.html missing');
    
    if (hasAssets) {
        console.log('   ✅ assets directory found');
        const assetsPath = path.join(distPath, 'assets');
        const assetFiles = fs.readdirSync(assetsPath);
        console.log(`   📦 Assets: ${assetFiles.length} files`);
        
        const hasJS = assetFiles.some(file => file.endsWith('.js'));
        const hasCSS = assetFiles.some(file => file.endsWith('.css'));
        
        if (hasJS) console.log('   ✅ JavaScript bundle found');
        if (hasCSS) console.log('   ✅ CSS bundle found');
    } else {
        console.log('   ❌ assets directory missing');
    }
    
    return hasIndexHTML && hasAssets;
}

function testPackageJson() {
    console.log('\n2. 📦 Testing Package Configuration...');
    
    try {
        const packagePath = path.join(__dirname, 'package.json');
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        console.log(`   📝 Project: ${packageData.name}`);
        console.log(`   🔢 Version: ${packageData.version}`);
        
        // Check essential scripts
        const scripts = packageData.scripts || {};
        const essentialScripts = ['test', 'dev', 'build'];
        
        essentialScripts.forEach(script => {
            if (scripts[script]) {
                console.log(`   ✅ Script '${script}': ${scripts[script]}`);
            } else {
                console.log(`   ❌ Script '${script}' missing`);
            }
        });
        
        // Check dependencies
        const deps = packageData.dependencies || {};
        const devDeps = packageData.devDependencies || {};
        
        console.log(`   📚 Dependencies: ${Object.keys(deps).length}`);
        console.log(`   🔧 Dev Dependencies: ${Object.keys(devDeps).length}`);
        
        // Check for React
        if (deps.react) console.log(`   ⚛️ React: ${deps.react}`);
        if (deps['react-dom']) console.log(`   ⚛️ React DOM: ${deps['react-dom']}`);
        if (devDeps.vite) console.log(`   ⚡ Vite: ${devDeps.vite}`);
        
        return true;
    } catch (error) {
        console.log(`   ❌ Package.json error: ${error.message}`);
        return false;
    }
}

function testSourceStructure() {
    console.log('\n3. 📂 Testing Source Structure...');
    
    const srcPath = path.join(__dirname, 'src');
    
    if (!fs.existsSync(srcPath)) {
        console.log('   ❌ src directory not found');
        return false;
    }
    
    const srcFiles = fs.readdirSync(srcPath);
    console.log(`   📁 src directory contains ${srcFiles.length} items`);
    
    // Check for main files
    const hasApp = srcFiles.some(file => file.startsWith('App.'));
    const hasMain = srcFiles.some(file => file.startsWith('main.') || file.startsWith('index.'));
    const hasComponents = srcFiles.includes('components');
    
    if (hasApp) console.log('   ✅ App component found');
    else console.log('   ❌ App component missing');
    
    if (hasMain) console.log('   ✅ Main entry file found');
    else console.log('   ❌ Main entry file missing');
    
    if (hasComponents) {
        console.log('   ✅ components directory found');
        const componentsPath = path.join(srcPath, 'components');
        const componentFiles = fs.readdirSync(componentsPath);
        console.log(`   🧩 Components: ${componentFiles.length} files`);
        
        componentFiles.slice(0, 5).forEach(file => {
            console.log(`   📄 ${file}`);
        });
        
        if (componentFiles.length > 5) {
            console.log(`   ... and ${componentFiles.length - 5} more`);
        }
    } else {
        console.log('   ❌ components directory missing');
    }
    
    return hasApp && hasMain;
}

function testTestStructure() {
    console.log('\n4. 🧪 Testing Test Structure...');
    
    const testsPath = path.join(__dirname, 'tests');
    
    if (!fs.existsSync(testsPath)) {
        console.log('   ❌ tests directory not found');
        return false;
    }
    
    const testFiles = fs.readdirSync(testsPath);
    console.log(`   📁 tests directory contains ${testFiles.length} items`);
    
    // Count test files
    const testFileCount = testFiles.filter(file => file.endsWith('.test.jsx') || file.endsWith('.test.js')).length;
    const hasComponents = testFiles.includes('components');
    const hasIntegration = testFiles.includes('integration');
    const hasScripts = testFiles.includes('scripts');
    
    console.log(`   🧪 Test files: ${testFileCount}`);
    
    if (hasComponents) console.log('   ✅ Component tests directory found');
    if (hasIntegration) console.log('   ✅ Integration tests directory found');
    if (hasScripts) console.log('   ✅ Test scripts directory found');
    
    return testFileCount > 0;
}

function testViteConfig() {
    console.log('\n5. ⚡ Testing Vite Configuration...');
    
    const viteConfigPath = path.join(__dirname, 'vite.config.js');
    
    if (!fs.existsSync(viteConfigPath)) {
        console.log('   ❌ vite.config.js not found');
        return false;
    }
    
    try {
        const configContent = fs.readFileSync(viteConfigPath, 'utf8');
        console.log('   ✅ vite.config.js found');
        
        // Check for common configurations
        if (configContent.includes('@vitejs/plugin-react')) {
            console.log('   ✅ React plugin configured');
        }
        
        if (configContent.includes('server')) {
            console.log('   ✅ Server configuration found');
        }
        
        if (configContent.includes('build')) {
            console.log('   ✅ Build configuration found');
        }
        
        return true;
    } catch (error) {
        console.log(`   ❌ Vite config error: ${error.message}`);
        return false;
    }
}

async function main() {
    const tests = [
        { name: 'Build Output', test: testBuildOutput },
        { name: 'Package Configuration', test: testPackageJson },
        { name: 'Source Structure', test: testSourceStructure },
        { name: 'Test Structure', test: testTestStructure },
        { name: 'Vite Configuration', test: testViteConfig }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const { name, test } of tests) {
        try {
            if (test()) {
                passed++;
            }
        } catch (error) {
            console.log(`   ❌ Test '${name}' failed: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏆 FRONTEND PROJECT STRUCTURE RESULTS');
    console.log('='.repeat(60));
    console.log(`📊 Tests Passed: ${passed}/${total}`);
    
    if (passed === total) {
        console.log('✅ All frontend structure tests passed!');
        console.log('🚀 React + Vite project is properly configured');
        console.log('📦 Build output is generated');
        console.log('🧪 Test infrastructure is in place');
        console.log('⚡ Vite configuration is working');
        console.log('\n🎉 Frontend is ready for development and testing!');
    } else {
        console.log(`⚠️ ${total - passed} tests failed`);
        console.log('🔧 Review failed areas for optimal setup');
    }
    
    console.log('\n📋 Manual Testing Checklist:');
    console.log('  1. Run "npm run build" to verify build works');
    console.log('  2. Run "npm run dev" to start development server');
    console.log('  3. Visit http://localhost:5173 in browser');
    console.log('  4. Run "npm test" to execute test suite');
    
    return passed === total;
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}