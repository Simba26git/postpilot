import { NextResponse } from 'next/server';

// This endpoint provides the AI training data to be used in content generation
export async function GET() {
  try {
    // Fetch all completed training documents
    const trainingDocumentsResponse = await fetch('http://localhost:3000/api/ai/training-documents');
    const trainingDocuments = await trainingDocumentsResponse.json();
    
    const completedDocs = trainingDocuments.filter((doc: any) => doc.status === 'completed');
    
    // Aggregate all training insights
    const brandGuidelines = {
      brandVoice: extractBrandVoice(completedDocs),
      toneCharacteristics: extractToneCharacteristics(completedDocs),
      keyTopics: extractKeyTopics(completedDocs),
      writingStyle: extractWritingStyle(completedDocs),
      targetAudience: extractTargetAudience(completedDocs),
      colorPalette: extractColorPalette(completedDocs),
      designPrinciples: extractDesignPrinciples(completedDocs),
      contentGuidelines: extractContentGuidelines(completedDocs),
      companyInfo: extractCompanyInfo(completedDocs),
      productInfo: extractProductInfo(completedDocs)
    };

    return NextResponse.json({
      success: true,
      trainingDocumentsCount: completedDocs.length,
      lastUpdated: new Date().toISOString(),
      brandGuidelines,
      trainingStatus: completedDocs.length > 0 ? 'trained' : 'untrained',
      confidenceScore: calculateConfidenceScore(completedDocs)
    });
  } catch (error) {
    console.error('Failed to fetch training data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch training data',
      brandGuidelines: getDefaultGuidelines()
    }, { status: 500 });
  }
}

function extractBrandVoice(docs: any[]) {
  const voices = docs.map(doc => doc.insights?.brandVoice).filter(Boolean);
  if (voices.length === 0) return "Professional and engaging";
  
  // Find most common voice or combine them intelligently
  const voiceMap: { [key: string]: number } = {};
  voices.forEach(voice => {
    voiceMap[voice] = (voiceMap[voice] || 0) + 1;
  });
  
  const sortedVoices = Object.entries(voiceMap).sort((a, b) => b[1] - a[1]);
  return sortedVoices[0][0];
}

function extractToneCharacteristics(docs: any[]) {
  const allTones = docs.flatMap(doc => doc.insights?.toneCharacteristics || []);
  const uniqueTones = [...new Set(allTones)];
  return uniqueTones.slice(0, 8); // Limit to top 8 characteristics
}

function extractKeyTopics(docs: any[]) {
  const allTopics = docs.flatMap(doc => doc.insights?.keyTopics || []);
  const topicMap: { [key: string]: number } = {};
  
  allTopics.forEach(topic => {
    topicMap[topic] = (topicMap[topic] || 0) + 1;
  });
  
  return Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([topic]) => topic);
}

function extractWritingStyle(docs: any[]) {
  const styles = docs.map(doc => doc.insights?.writingStyle).filter(Boolean);
  if (styles.length === 0) return "Clear, concise, and engaging with a focus on value-driven messaging";
  
  // Combine multiple writing styles into a comprehensive description
  return styles.join(". ");
}

function extractTargetAudience(docs: any[]) {
  const audiences = docs.map(doc => doc.insights?.targetAudience).filter(Boolean);
  if (audiences.length === 0) return "Professionals and consumers interested in quality products and services";
  
  return audiences[0]; // Use the first defined target audience
}

function extractColorPalette(docs: any[]) {
  const colors = docs.flatMap(doc => doc.insights?.colorPalette || []);
  return [...new Set(colors)].slice(0, 6);
}

function extractDesignPrinciples(docs: any[]) {
  const principles = docs.flatMap(doc => doc.insights?.designPrinciples || []);
  return [...new Set(principles)].slice(0, 8);
}

function extractContentGuidelines(docs: any[]) {
  const guidelines = docs.map(doc => {
    switch (doc.type) {
      case 'brand-guidelines':
        return {
          type: 'Brand Guidelines',
          summary: doc.summary || 'Core brand identity and messaging principles',
          keyPoints: doc.insights?.keyTopics?.slice(0, 5) || []
        };
      case 'voice-tone':
        return {
          type: 'Voice & Tone',
          summary: `Brand voice: ${doc.insights?.brandVoice}. Tone characteristics: ${doc.insights?.toneCharacteristics?.join(', ')}`,
          keyPoints: doc.insights?.toneCharacteristics || []
        };
      case 'style-guide':
        return {
          type: 'Style Guide',
          summary: doc.insights?.writingStyle || 'Visual and content style guidelines',
          keyPoints: doc.insights?.designPrinciples || []
        };
      case 'marketing-copy':
        return {
          type: 'Marketing Examples',
          summary: 'Reference examples for marketing communications',
          keyPoints: doc.insights?.keyTopics?.slice(0, 5) || []
        };
      case 'product-info':
        return {
          type: 'Product Information',
          summary: 'Key product features and messaging',
          keyPoints: doc.insights?.keyTopics?.slice(0, 5) || []
        };
      default:
        return {
          type: 'Training Document',
          summary: doc.summary || 'Additional training content',
          keyPoints: doc.insights?.keyTopics?.slice(0, 3) || []
        };
    }
  });
  
  return guidelines;
}

function extractCompanyInfo(docs: any[]) {
  // Extract company information from brand guidelines and product info
  const brandDocs = docs.filter(doc => 
    doc.type === 'brand-guidelines' || doc.type === 'product-info'
  );
  
  if (brandDocs.length === 0) {
    return {
      name: "Your Company",
      mission: "To provide exceptional products and services",
      values: ["Quality", "Innovation", "Customer Focus"],
      differentiators: ["Unique value proposition", "Expert team", "Proven results"]
    };
  }
  
  return {
    name: "Your Company", // Would be extracted from actual document content
    mission: "Extracted from brand guidelines documents",
    values: extractKeyTopics(brandDocs).slice(0, 5),
    differentiators: brandDocs[0]?.insights?.keyTopics?.slice(0, 3) || []
  };
}

function extractProductInfo(docs: any[]) {
  const productDocs = docs.filter(doc => doc.type === 'product-info');
  
  if (productDocs.length === 0) {
    return {
      categories: ["Products", "Services"],
      keyFeatures: ["High Quality", "User-Friendly", "Reliable"],
      benefits: ["Saves Time", "Increases Efficiency", "Great Value"]
    };
  }
  
  return {
    categories: productDocs.map(doc => doc.name),
    keyFeatures: extractKeyTopics(productDocs).slice(0, 8),
    benefits: productDocs.flatMap(doc => doc.insights?.toneCharacteristics || []).slice(0, 6)
  };
}

function calculateConfidenceScore(docs: any[]) {
  if (docs.length === 0) return 0;
  
  let score = 0;
  
  // Base score for having documents
  score += Math.min(docs.length * 15, 60); // Up to 60 points for multiple docs
  
  // Points for different document types
  const types = [...new Set(docs.map(doc => doc.type))];
  score += types.length * 5; // 5 points per document type
  
  // Points for comprehensive insights
  docs.forEach(doc => {
    if (doc.insights?.brandVoice) score += 5;
    if (doc.insights?.toneCharacteristics?.length > 0) score += 5;
    if (doc.insights?.keyTopics?.length > 5) score += 5;
    if (doc.insights?.writingStyle) score += 5;
  });
  
  return Math.min(score, 100);
}

function getDefaultGuidelines() {
  return {
    brandVoice: "Professional and engaging",
    toneCharacteristics: ["Friendly", "Professional", "Helpful", "Informative"],
    keyTopics: ["Quality", "Innovation", "Customer Service", "Value", "Expertise"],
    writingStyle: "Clear, concise, and engaging with a focus on value-driven messaging",
    targetAudience: "Professionals and consumers interested in quality products and services",
    colorPalette: ["#007BFF", "#28A745", "#FFC107", "#DC3545"],
    designPrinciples: ["Clean", "Modern", "Professional", "User-Friendly"],
    contentGuidelines: [],
    companyInfo: {
      name: "Your Company",
      mission: "To provide exceptional products and services",
      values: ["Quality", "Innovation", "Customer Focus"],
      differentiators: ["Unique value proposition", "Expert team", "Proven results"]
    },
    productInfo: {
      categories: ["Products", "Services"],
      keyFeatures: ["High Quality", "User-Friendly", "Reliable"],
      benefits: ["Saves Time", "Increases Efficiency", "Great Value"]
    }
  };
}
