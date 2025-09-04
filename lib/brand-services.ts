// Brand Assets and AI Training Services

export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'color_palette' | 'font' | 'guidelines' | 'template' | 'other';
  url: string;
  uploadedAt: string;
  size: number;
  format: string;
  metadata?: {
    colors?: string[];
    fonts?: string[];
    dimensions?: string;
  };
}

export interface TrainingDocument {
  id: string;
  name: string;
  type: 'brand_guidelines' | 'voice_tone' | 'style_guide' | 'examples' | 'regulations' | 'other';
  url: string;
  uploadedAt: string;
  size: number;
  format: string;
  processed: boolean;
  extractedText?: string;
  aiInsights?: {
    brandVoice: string;
    keyThemes: string[];
    writingStyle: string;
    dosDonts: string[];
  };
}

export interface ContentLibraryItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'flyer' | 'carousel' | 'story';
  url: string;
  thumbnail?: string;
  createdAt: string;
  platform: string;
  prompt?: string;
  tags: string[];
  status: 'draft' | 'approved' | 'published' | 'archived';
  aiGenerated: boolean;
  metadata: {
    dimensions?: string;
    duration?: number;
    fileSize: number;
    format: string;
  };
  usage: {
    downloads: number;
    shares: number;
    lastUsed?: string;
  };
}

export class BrandAssetsService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  static async uploadBrandAsset(file: File, type: BrandAsset['type'], metadata?: any): Promise<BrandAsset> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      if (metadata) formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${this.API_BASE}/brand/upload-asset`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Asset upload failed');
      return await response.json();
    } catch (error) {
      console.error('Asset upload failed:', error);
      throw error;
    }
  }

  static async getBrandAssets(): Promise<BrandAsset[]> {
    try {
      const response = await fetch(`${this.API_BASE}/brand/assets`);
      if (!response.ok) throw new Error('Failed to fetch brand assets');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch brand assets:', error);
      throw error;
    }
  }

  static async deleteBrandAsset(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/brand/assets/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete asset');
    } catch (error) {
      console.error('Failed to delete asset:', error);
      throw error;
    }
  }
}

export class AITrainingService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  static async uploadTrainingDocument(file: File, type: TrainingDocument['type']): Promise<TrainingDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${this.API_BASE}/ai/upload-training`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Training document upload failed');
      return await response.json();
    } catch (error) {
      console.error('Training document upload failed:', error);
      throw error;
    }
  }

  static async getTrainingDocuments(): Promise<TrainingDocument[]> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/training-documents`);
      if (!response.ok) throw new Error('Failed to fetch training documents');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch training documents:', error);
      throw error;
    }
  }

  static async processDocument(id: string): Promise<TrainingDocument> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/process-training/${id}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to process document');
      return await response.json();
    } catch (error) {
      console.error('Failed to process document:', error);
      throw error;
    }
  }

  static async getBrandInsights(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/ai/brand-insights`);
      if (!response.ok) throw new Error('Failed to fetch brand insights');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch brand insights:', error);
      throw error;
    }
  }
}

export class ContentLibraryService {
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  static async getContentLibrary(filters?: {
    type?: string;
    platform?: string;
    status?: string;
    dateRange?: string;
  }): Promise<ContentLibraryItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await fetch(`${this.API_BASE}/content/library?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content library');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch content library:', error);
      throw error;
    }
  }

  static async saveGeneratedContent(content: any, metadata: any): Promise<ContentLibraryItem> {
    try {
      const response = await fetch(`${this.API_BASE}/content/library`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata })
      });

      if (!response.ok) throw new Error('Failed to save content');
      return await response.json();
    } catch (error) {
      console.error('Failed to save content:', error);
      throw error;
    }
  }

  static async updateContentStatus(id: string, status: ContentLibraryItem['status']): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/library/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update content status');
    } catch (error) {
      console.error('Failed to update content status:', error);
      throw error;
    }
  }

  static async deleteContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/library/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete content');
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw error;
    }
  }
}
