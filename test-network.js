#!/usr/bin/env node

// Network Connectivity Test for Expo Go
// This script tests if your backend is accessible from both localhost and your network IP

const testNetworkConnectivity = async () => {
  console.log('🌐 Testing Network Connectivity for Expo Go...\n');
  
  const localhost = 'http://localhost:3000';
  const networkIP = 'http://192.168.43.66:3000';
  
  // Test 1: Localhost (for web browser)
  console.log('1️⃣ Testing localhost (web browser access)...');
  try {
    const response = await fetch(`${localhost}/api/health`);
    console.log(`   ✅ Localhost accessible (Status: ${response.status})`);
  } catch (error) {
    console.log(`   ❌ Localhost failed: ${error.message}`);
    console.log('   💡 Make sure your backend server is running');
  }
  
  // Test 2: Network IP (for Expo Go)
  console.log('\n2️⃣ Testing network IP (Expo Go access)...');
  try {
    const response = await fetch(`${networkIP}/api/health`);
    console.log(`   ✅ Network IP accessible (Status: ${response.status})`);
    console.log('   🎉 Expo Go should be able to connect!');
  } catch (error) {
    console.log(`   ❌ Network IP failed: ${error.message}`);
    console.log('   💡 Backend might not be listening on 0.0.0.0');
    console.log('   💡 Or Windows Firewall is blocking the connection');
  }
  
  // Test 3: GPT endpoint on network IP
  console.log('\n3️⃣ Testing GPT endpoint on network IP...');
  try {
    const response = await fetch(`${networkIP}/api/gpt/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: 'Test connection from network' 
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`   ✅ GPT endpoint working on network IP`);
      console.log(`   📚 Got ${data.data.recommendations.length} recommendations`);
    } else {
      console.log(`   ⚠️ GPT endpoint returned error: ${data.message || data.error}`);
    }
  } catch (error) {
    console.log(`   ❌ GPT endpoint on network IP failed: ${error.message}`);
  }
  
  console.log('\n📋 Summary:');
  console.log('   • Web Browser should use: http://localhost:3000');
  console.log('   • Expo Go should use: http://192.168.43.66:3000');
  console.log('\n💡 If network IP tests fail:');
  console.log('   1. Update backend to listen on 0.0.0.0:3000 (not localhost:3000)');
  console.log('   2. Check Windows Firewall settings');
  console.log('   3. Verify your IP address with: ipconfig');
  console.log('   4. Restart your backend server');
};

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with native fetch support');
  console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

testNetworkConnectivity().catch(console.error);
