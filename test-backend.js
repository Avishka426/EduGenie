#!/usr/bin/env node

// Backend Health Check Script
// This script tests if your backend server is running and accessible

const testBackendConnection = async () => {
  console.log('🔍 Testing Backend Connection...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Basic server connectivity
  console.log('1️⃣ Testing basic server connectivity...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    console.log(`   ✅ Server is running (Status: ${response.status})`);
  } catch (error) {
    console.log(`   ❌ Server connection failed: ${error.message}`);
    console.log('   💡 Make sure your backend server is running on port 3000\n');
    return;
  }
  
  // Test 2: GPT Recommendations endpoint
  console.log('\n2️⃣ Testing GPT recommendations endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/gpt/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: 'I want to learn web development from scratch' 
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`   ✅ GPT endpoint working (${data.data.recommendations.length} recommendations)`);
      console.log(`   📊 API calls used: ${data.data.metadata.apiCallsUsed}`);
    } else {
      console.log(`   ⚠️ GPT endpoint returned error: ${data.message || data.error}`);
    }
  } catch (error) {
    console.log(`   ❌ GPT endpoint failed: ${error.message}`);
  }
  
  // Test 3: CORS check (for web requests)
  console.log('\n3️⃣ Checking CORS configuration...');
  try {
    const response = await fetch(`${baseUrl}/api/gpt/recommendations`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:19006',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    };
    
    if (corsHeaders['Access-Control-Allow-Origin']) {
      console.log('   ✅ CORS is configured');
      console.log(`      Origin: ${corsHeaders['Access-Control-Allow-Origin']}`);
    } else {
      console.log('   ⚠️ CORS might not be configured properly');
      console.log('   💡 Make sure your backend allows requests from http://localhost:19006');
    }
  } catch (error) {
    console.log(`   ❌ CORS check failed: ${error.message}`);
  }
  
  console.log('\n🎉 Backend health check complete!');
  console.log('\n💡 If you see errors above:');
  console.log('   1. Make sure your backend server is running');
  console.log('   2. Check that it\'s listening on port 3000');
  console.log('   3. Verify the GPT endpoints are implemented');
  console.log('   4. Ensure CORS is configured for web requests');
};

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with native fetch support');
  console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

testBackendConnection().catch(console.error);
