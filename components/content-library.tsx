'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Share2, 
  Eye, 
  Clock, 
  Filter, 
  Search,
  MoreHorizontal,
  Calendar,
  Tag,
  Play,
  Image as ImageIcon,
  FileText,
  Grid
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'flyer' | 'carousel';
  url: string;
  thumbnail: string;
  createdAt: string;
  platform: string;
  prompt?: string;
  tags: string[];
  status: 'draft' | 'approved' | 'published' | 'archived';
  aiGenerated: boolean;
  metadata: {
    dimensions: string;
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

const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video':
      return <Play className="w-4 h-4" />;
    case 'flyer':
      return <FileText className="w-4 h-4" />;
    case 'carousel':
      return <Grid className="w-4 h-4" />;
    default:
      return <ImageIcon className="w-4 h-4" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    approved: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <Badge className={colors[status as keyof typeof colors] || colors.draft}>
      {status}
    </Badge>
  );
};

export default function ContentLibrary() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, selectedType, selectedPlatform, selectedStatus]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/library');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(item => item.platform === selectedPlatform);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredContent(filtered);
  };

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Content Library</h2>
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
          <h2 className="text-3xl font-bold">Content Library</h2>
          <p className="text-muted-foreground">
            Manage and organize all your generated content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
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
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="flyer">Flyers</SelectItem>
                <SelectItem value="carousel">Carousels</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ContentTypeIcon type={item.type} />
                    {item.type}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <StatusBadge status={item.status} />
                </div>
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.platform}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags && item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags && item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(item.createdAt)}</span>
                    <span>{formatFileSize(item.metadata.fileSize)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.usage.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {item.usage.shares}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const link = document.createElement('a');
                          link.href = item.url;
                          link.download = item.name;
                          link.click();
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          console.log('Content link copied to clipboard');
                        }}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredContent.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 ${
                    index !== filteredContent.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <ContentTypeIcon type={item.type} />
                        {item.type}
                      </Badge>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.platform}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags && item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{formatDate(item.createdAt)}</p>
                    <p>{formatFileSize(item.metadata.fileSize)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.usage.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {item.usage.shares}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = item.name;
                        link.click();
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        console.log('Content link copied to clipboard');
                      }}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedType !== 'all' || selectedPlatform !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters to see more content.'
                : 'Start creating content with AI Studio to see it here.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
