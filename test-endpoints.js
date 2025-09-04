// Test script to verify all API endpoints are working
// This file can be deleted after testing

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  const endpoints = [
    '/api/content/library',
    '/api/brand/assets',
    '/api/ai/training-documents'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`${endpoint}: Error -`, error.message);
    }
  }
};

// Uncomment to test endpoints
// testEndpoints();
