'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Palette, 
  Download,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  FolderOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'image' | 'document' | 'color-palette' | 'font';
  url: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  uploadedAt: string;
  fileSize: number;
  format: string;
  description?: string;
  metadata?: {
    dimensions?: string;
    colors?: string[];
    usage?: string;
  };
}

const AssetTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'logo':
      return <ImageIcon className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'document':
      return <FileText className="w-4 h-4" />;
    case 'color-palette':
      return <Palette className="w-4 h-4" />;
    case 'font':
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export default function BrandAssetsManager() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'logo' as BrandAsset['type'],
    category: '',
    description: '',
    tags: '',
    usage: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, selectedType, selectedCategory]);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/brand/assets');
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch brand assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    setFilteredAssets(filtered);
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('metadata', JSON.stringify({
        ...uploadForm,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }));

      const response = await fetch('/api/brand/upload-asset', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newAsset = await response.json();
        setAssets(prev => [newAsset, ...prev]);
        setUploadDialogOpen(false);
        setUploadForm({
          name: '',
          type: 'logo',
          category: '',
          description: '',
          tags: '',
          usage: ''
        });
        
        // Show success notification (you can customize this)
        console.log('Asset uploaded successfully:', newAsset);
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [uploadForm]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categories = [...new Set(assets.map(asset => asset.category))];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Brand Assets</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Brand Assets</h2>
          <p className="text-muted-foreground">
            Manage your logos, images, documents, and brand guidelines
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Brand Asset</DialogTitle>
              <DialogDescription>
                Add a new asset to your brand library
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input
                  id="asset-name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter asset name"
                />
              </div>
              <div>
                <Label htmlFor="asset-type">Type</Label>
                <Select value={uploadForm.type} onValueChange={(value: BrandAsset['type']) => setUploadForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="color-palette">Color Palette</SelectItem>
                    <SelectItem value="font">Font</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="asset-category">Category</Label>
                <Input
                  id="asset-category"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Primary Logo, Marketing, Guidelines"
                />
              </div>
              <div>
                <Label htmlFor="asset-description">Description</Label>
                <Textarea
                  id="asset-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this asset..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="asset-tags">Tags</Label>
                <Input
                  id="asset-tags"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label htmlFor="asset-usage">Usage Guidelines</Label>
                <Textarea
                  id="asset-usage"
                  value={uploadForm.usage}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, usage: e.target.value }))}
                  placeholder="How should this asset be used?"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="file-upload">Choose File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  disabled={uploading}
                />
              </div>
              {uploading && (
                <div className="text-center text-sm text-muted-foreground">
                  Uploading...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="logo">Logos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="color-palette">Color Palettes</SelectItem>
                <SelectItem value="font">Fonts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              {asset.type === 'color-palette' ? (
                <div className="w-full h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-lg flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              ) : asset.thumbnail || asset.url ? (
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <AssetTypeIcon type={asset.type} />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AssetTypeIcon type={asset.type} />
                  {asset.type}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground">{asset.category}</p>
                </div>
                
                {asset.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {asset.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {asset.tags && asset.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags && asset.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{asset.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(asset.uploadedAt)}</span>
                  <span>{formatFileSize(asset.fileSize)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = asset.url;
                      link.download = asset.name;
                      link.click();
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('Edit asset:', asset.id);
                      // You can add edit functionality here
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this asset?')) {
                        setAssets(prev => prev.filter(a => a.id !== asset.id));
                        console.log('Deleted asset:', asset.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters to see more assets.'
                : 'Upload your first brand asset to get started.'}
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
