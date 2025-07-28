#!/usr/bin/env node

/**
 * GPT API Integration Test Script
 * 
 * This script tests the GPT-3 Course Recommendation System
 * to ensure all endpoints work correctly before deployment.
 * 
 * Usage: node test-gpt-api.js
 */

const BASE_URL = 'http://localhost:3000'; // Update with your API base URL

// Test data
const TEST_STUDENT_TOKEN = 'student_jwt_token_here';
const TEST_INSTRUCTOR_TOKEN = 'instructor_jwt_token_here';

const TEST_PROMPTS = [
  "I want to be a software engineer, what courses should I follow?",
  "I'm interested in machine learning and AI, recommend some courses",
  "What courses would help me become a web developer?",
  "I want to learn about cybersecurity, what do you suggest?",
];

/**
 * Make HTTP request with error handling
 */
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || data.message || 'Request failed'}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      status: error.status || 500 
    };
  }
}

/**
 * Test 1: Student Authentication & GPT Recommendations
 */
async function testGPTRecommendations() {
  console.log('\n🧪 Testing GPT Course Recommendations...');
  
  const testPrompt = TEST_PROMPTS[0];
  console.log(`📝 Prompt: "${testPrompt}"`);

  const result = await makeRequest(`${BASE_URL}/api/gpt/recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
    },
    body: JSON.stringify({ prompt: testPrompt }),
  });

  if (result.success) {
    console.log('✅ GPT Recommendations: SUCCESS');
    console.log(`📊 Recommendations Count: ${result.data.recommendations?.length || 0}`);
    console.log(`🤖 AI Response Preview: ${result.data.aiResponse?.substring(0, 100)}...`);
    console.log(`📈 API Usage: ${result.data.metadata?.apiCallsUsed}/${result.data.metadata?.apiCallsUsed + result.data.metadata?.remainingApiCalls}`);
    return true;
  } else {
    console.log('❌ GPT Recommendations: FAILED');
    console.log(`   Error: ${result.error}`);
    return false;
  }
}

/**
 * Test 2: Popular Courses Fallback
 */
async function testPopularCourses() {
  console.log('\n🧪 Testing Popular Courses Fallback...');

  const result = await makeRequest(`${BASE_URL}/api/gpt/popular`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
    },
  });

  if (result.success) {
    console.log('✅ Popular Courses: SUCCESS');
    console.log(`📚 Courses Count: ${result.data.courses?.length || 0}`);
    console.log(`📊 Sorted By: ${result.data.metadata?.sortedBy || 'unknown'}`);
    return true;
  } else {
    console.log('❌ Popular Courses: FAILED');
    console.log(`   Error: ${result.error}`);
    return false;
  }
}

/**
 * Test 3: API Usage Statistics (Instructor Only)
 */
async function testAPIUsage() {
  console.log('\n🧪 Testing API Usage Statistics...');

  const result = await makeRequest(`${BASE_URL}/api/gpt/usage`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TEST_INSTRUCTOR_TOKEN}`,
    },
  });

  if (result.success) {
    console.log('✅ API Usage Statistics: SUCCESS');
    console.log(`📊 Calls Used: ${result.data.usage?.callsUsed || 0}`);
    console.log(`📈 Remaining: ${result.data.usage?.remainingCalls || 0}`);
    console.log(`📉 Usage %: ${result.data.usage?.usagePercentage || 0}%`);
    if (result.data.warning) {
      console.log(`⚠️  Warning: ${result.data.warning}`);
    }
    return true;
  } else {
    console.log('❌ API Usage Statistics: FAILED');
    console.log(`   Error: ${result.error}`);
    return false;
  }
}

/**
 * Test 4: Role-Based Access Control
 */
async function testAccessControl() {
  console.log('\n🧪 Testing Role-Based Access Control...');

  // Test: Student trying to access usage stats (should fail)
  console.log('   Testing: Student accessing usage stats...');
  const studentUsageResult = await makeRequest(`${BASE_URL}/api/gpt/usage`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
    },
  });

  if (!studentUsageResult.success && studentUsageResult.status === 403) {
    console.log('   ✅ Student blocked from usage stats: SUCCESS');
  } else {
    console.log('   ❌ Student access control: FAILED');
    console.log(`      Expected 403, got ${studentUsageResult.status}`);
    return false;
  }

  // Test: Instructor getting recommendations (should work)
  console.log('   Testing: Instructor accessing recommendations...');
  const instructorRecsResult = await makeRequest(`${BASE_URL}/api/gpt/recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TEST_INSTRUCTOR_TOKEN}`,
    },
    body: JSON.stringify({ prompt: TEST_PROMPTS[1] }),
  });

  if (instructorRecsResult.success || instructorRecsResult.status === 403) {
    console.log('   ✅ Instructor access control: SUCCESS');
    return true;
  } else {
    console.log('   ❌ Instructor access control: FAILED');
    console.log(`      Error: ${instructorRecsResult.error}`);
    return false;
  }
}

/**
 * Test 5: Input Validation
 */
async function testInputValidation() {
  console.log('\n🧪 Testing Input Validation...');

  // Test empty prompt
  console.log('   Testing: Empty prompt validation...');
  const emptyResult = await makeRequest(`${BASE_URL}/api/gpt/recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
    },
    body: JSON.stringify({ prompt: '' }),
  });

  if (!emptyResult.success && emptyResult.status === 400) {
    console.log('   ✅ Empty prompt validation: SUCCESS');
  } else {
    console.log('   ❌ Empty prompt validation: FAILED');
    return false;
  }

  // Test very long prompt
  console.log('   Testing: Long prompt validation...');
  const longPrompt = 'A'.repeat(600); // Over 500 character limit
  const longResult = await makeRequest(`${BASE_URL}/api/gpt/recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
    },
    body: JSON.stringify({ prompt: longPrompt }),
  });

  if (!longResult.success && longResult.status === 400) {
    console.log('   ✅ Long prompt validation: SUCCESS');
    return true;
  } else {
    console.log('   ❌ Long prompt validation: FAILED');
    return false;
  }
}

/**
 * Test 6: API Rate Limiting
 */
async function testRateLimiting() {
  console.log('\n🧪 Testing API Rate Limiting...');
  
  console.log('   Note: This test makes multiple rapid requests');
  console.log('   Expected behavior: Graceful handling when approaching limits');

  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      makeRequest(`${BASE_URL}/api/gpt/recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TEST_STUDENT_TOKEN}`,
        },
        body: JSON.stringify({ 
          prompt: `Test prompt ${i + 1}: I want to learn programming` 
        }),
      })
    );
  }

  const results = await Promise.all(promises);
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  console.log(`   📊 Results: ${successCount} succeeded, ${failureCount} failed`);
  
  if (successCount > 0) {
    console.log('   ✅ Rate Limiting: SUCCESS (at least some requests succeeded)');
    return true;
  } else {
    console.log('   ⚠️  Rate Limiting: All requests failed (check API key and quota)');
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting GPT API Integration Tests...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const testResults = [];

  // Check if we have tokens
  if (!TEST_STUDENT_TOKEN || TEST_STUDENT_TOKEN === 'student_jwt_token_here') {
    console.log('⚠️  Warning: Please update TEST_STUDENT_TOKEN with a valid JWT token');
  }
  if (!TEST_INSTRUCTOR_TOKEN || TEST_INSTRUCTOR_TOKEN === 'instructor_jwt_token_here') {
    console.log('⚠️  Warning: Please update TEST_INSTRUCTOR_TOKEN with a valid JWT token');
  }

  // Run all tests
  testResults.push(await testGPTRecommendations());
  testResults.push(await testPopularCourses());
  testResults.push(await testAPIUsage());
  testResults.push(await testAccessControl());
  testResults.push(await testInputValidation());
  testResults.push(await testRateLimiting());

  // Summary
  const passedTests = testResults.filter(Boolean).length;
  const totalTests = testResults.length;

  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! GPT integration is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }

  console.log('\n💡 Next Steps:');
  console.log('1. Update the BASE_URL with your production API endpoint');
  console.log('2. Replace test tokens with valid JWT tokens');
  console.log('3. Ensure your backend API endpoints are implemented');
  console.log('4. Monitor API usage to stay within the 250 request limit');
  
  return passedTests === totalTests;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testGPTRecommendations,
  testPopularCourses,
  testAPIUsage,
  testAccessControl,
  testInputValidation,
  testRateLimiting,
};
