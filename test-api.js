// Simple test to verify API connection
const testApiConnection = async () => {
  const API_BASE_URL = 'http://localhost:3000';
  const prompt = 'I want to learn web development from scratch';
  
  try {
    console.log('🧪 Testing API connection to:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/gpt/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ API test successful!');
      console.log('📚 Recommendations count:', data.data.recommendations.length);
    } else {
      console.log('❌ API test failed:', data.message || data.error);
    }
    
  } catch (error) {
    console.error('💥 API test error:', error);
  }
};

// For Node.js testing
if (typeof require !== 'undefined' && require.main === module) {
  testApiConnection();
}

// For browser testing
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
}
