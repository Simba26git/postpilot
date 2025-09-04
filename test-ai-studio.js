// Test script to verify AI Studio is working properly
const BASE_URL = 'http://localhost:3000';

async function testAIEndpoints() {
  console.log('🧪 Testing AI Studio Endpoints...\n');
  
  const tests = [
    {
      name: 'Training Data API',
      endpoint: '/api/ai/training-data',
      method: 'GET'
    },
    {
      name: 'Image Generation API',
      endpoint: '/api/ai/generate-image',
      method: 'POST',
      body: {
        prompt: 'A beautiful sunset over mountains',
        size: '1024x1024',
        style: 'vivid',
        platform: 'Instagram'
      }
    },
    {
      name: 'Video Generation API',
      endpoint: '/api/ai/generate-video',
      method: 'POST',
      body: {
        prompt: 'A peaceful lake with birds flying',
        duration: 10,
        aspect_ratio: '16:9',
        platform: 'YouTube'
      }
    },
    {
      name: 'Flyer Generation API',
      endpoint: '/api/ai/generate-flyer',
      method: 'POST',
      body: {
        template_type: 'business_flyer',
        text_content: 'Summer Sale - 50% Off Everything!',
        platform: 'Instagram'
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(`${BASE_URL}${test.endpoint}`, options);
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${test.name} - Success`);
        if (test.name === 'Training Data API') {
          console.log(`   Brand Voice: ${result.brandGuidelines?.brandVoice || 'Not set'}`);
          console.log(`   Training Status: ${result.trainingStatus}`);
        } else {
          console.log(`   Generated: ${result.type || 'content'}`);
          console.log(`   URL: ${result.url ? 'Available' : 'Generated'}`);
        }
      } else {
        console.log(`❌ ${test.name} - Failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
    
    console.log(''); // Add spacing
  }
  
  console.log('🎯 AI Studio Testing Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Navigate to AI Studio tab');
  console.log('3. Enter a prompt and test content generation');
  console.log('4. Check AI Training Center for brand guidelines');
  console.log('5. Verify generated content appears in Content Library');
}

// Run the tests
testAIEndpoints().catch(console.error);
