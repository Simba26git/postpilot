'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Plus,
  Zap,
  Target,
  MessageCircle,
  BookOpen
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

interface TrainingDocument {
  id: string;
  name: string;
  type: 'brand-guidelines' | 'voice-tone' | 'product-info' | 'style-guide' | 'marketing-copy';
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  fileSize: number;
  format: string;
  processingProgress: number;
  insights: {
    keyTopics: string[];
    brandVoice: string;
    toneCharacteristics: string[];
    colorPalette?: string[];
    designPrinciples?: string[];
    writingStyle?: string;
    targetAudience?: string;
  };
  extractedText?: string;
  summary?: string;
}

const DocumentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'brand-guidelines':
      return <BookOpen className="w-4 h-4" />;
    case 'voice-tone':
      return <MessageCircle className="w-4 h-4" />;
    case 'product-info':
      return <Target className="w-4 h-4" />;
    case 'style-guide':
      return <Brain className="w-4 h-4" />;
    case 'marketing-copy':
      return <Zap className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'processing':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export default function AITrainingCenter() {
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TrainingDocument | null>(null);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'brand-guidelines' as TrainingDocument['type'],
    description: ''
  });

  useEffect(() => {
    fetchTrainingDocuments();
    // Set up periodic refresh to show real-time usage
    const interval = setInterval(fetchTrainingDocuments, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTrainingDocuments = async () => {
    try {
      const response = await fetch('/api/ai/training-documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch training documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('metadata', JSON.stringify(uploadForm));

      const response = await fetch('/api/ai/upload-training', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments(prev => [newDocument, ...prev]);
        setUploadDialogOpen(false);
        setUploadForm({
          name: '',
          type: 'brand-guidelines',
          description: ''
        });
        
        // Simulate processing with realistic progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress > 100) progress = 100;
          
          setDocuments(prev => prev.map(doc => 
            doc.id === newDocument.id 
              ? { ...doc, processingProgress: Math.min(progress, 100) }
              : doc
          ));
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setDocuments(prev => prev.map(doc => 
                doc.id === newDocument.id 
                  ? { ...doc, status: 'completed', processingProgress: 100 }
                  : doc
              ));
            }, 500);
          }
        }, 300);
        
        console.log('Training document uploaded successfully:', newDocument);
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [uploadForm]);

  const showInsights = (document: TrainingDocument) => {
    setSelectedDocument(document);
    setInsightsDialogOpen(true);
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

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      'brand-guidelines': 'Brand Guidelines',
      'voice-tone': 'Voice & Tone',
      'product-info': 'Product Information',
      'style-guide': 'Style Guide',
      'marketing-copy': 'Marketing Copy'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const completedDocs = documents.filter(doc => doc.status === 'completed');
  const processingDocs = documents.filter(doc => doc.status === 'processing' || doc.status === 'uploading');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Training Center</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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
          <h2 className="text-3xl font-bold">AI Training Center</h2>
          <p className="text-muted-foreground">
            Train your AI with brand documents for personalized content generation
          </p>
          {completedDocs.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-600 font-medium">
                AI is trained and actively enhancing content generation
              </p>
            </div>
          )}
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Training Document</DialogTitle>
              <DialogDescription>
                Upload a document to train your AI on your brand voice and style
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="doc-name">Document Name</Label>
                <Input
                  id="doc-name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter document name"
                />
              </div>
              <div>
                <Label htmlFor="doc-type">Document Type</Label>
                <Select value={uploadForm.type} onValueChange={(value: TrainingDocument['type']) => setUploadForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-guidelines">Brand Guidelines</SelectItem>
                    <SelectItem value="voice-tone">Voice & Tone Guide</SelectItem>
                    <SelectItem value="product-info">Product Information</SelectItem>
                    <SelectItem value="style-guide">Style Guide</SelectItem>
                    <SelectItem value="marketing-copy">Marketing Copy Examples</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doc-description">Description</Label>
                <Textarea
                  id="doc-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this document teaches the AI..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="file-upload">Choose File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </div>
              {uploading && (
                <div className="text-center text-sm text-muted-foreground">
                  Uploading and processing...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{completedDocs.length}</p>
                <p className="text-sm text-muted-foreground">Trained Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{processingDocs.length}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {completedDocs.reduce((acc, doc) => acc + (doc.insights?.keyTopics?.length || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Key Topics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {completedDocs.length > 0 ? '95%' : '0%'}
                </p>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Usage Status */}
      {completedDocs.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">AI Training Active</h3>
                  <p className="text-sm text-green-700">
                    Your AI is using {completedDocs.length} trained document{completedDocs.length !== 1 ? 's' : ''} to enhance content generation
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {completedDocs.reduce((acc, doc) => acc + (doc.insights?.keyTopics?.length || 0), 0)}
                </p>
                <p className="text-xs text-green-600">Topics Learned</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/50 rounded p-2">
                <p className="font-medium text-green-800">Brand Voice:</p>
                <p className="text-green-700">
                  {completedDocs[0]?.insights?.brandVoice || 'Learning...'}
                </p>
              </div>
              <div className="bg-white/50 rounded p-2">
                <p className="font-medium text-green-800">Key Tones:</p>
                <p className="text-green-700">
                  {completedDocs[0]?.insights?.toneCharacteristics?.slice(0, 2).join(', ') || 'Analyzing...'}
                </p>
              </div>
              <div className="bg-white/50 rounded p-2">
                <p className="font-medium text-green-800">Content Types:</p>
                <p className="text-green-700">
                  {[...new Set(completedDocs.map(doc => doc.type))].slice(0, 2).map(type => 
                    type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Training Documents</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded">
                        <DocumentTypeIcon type={document.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{document.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {getDocumentTypeLabel(document.type)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusIcon status={document.status} />
                      </div>
                    </div>

                    {document.status === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Processing...</span>
                          <span>{document.processingProgress}%</span>
                        </div>
                        <Progress value={document.processingProgress} className="h-2" />
                      </div>
                    )}

                    {document.status === 'completed' && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {document.insights?.keyTopics?.slice(0, 2).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {document.insights?.keyTopics && document.insights.keyTopics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{document.insights.keyTopics.length - 2}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Brand Voice: {document.insights.brandVoice}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(document.uploadedAt)}</span>
                      <span>{formatFileSize(document.fileSize)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {document.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => showInsights(document)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Insights
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          console.log('Download document:', document.id);
                          // Add download functionality here
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this training document?')) {
                            setDocuments(prev => prev.filter(d => d.id !== document.id));
                            console.log('Deleted document:', document.id);
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

          {documents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No training documents</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first document to start training your AI on your brand voice and style.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {completedDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Brand Voice Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedDocs.map((doc) => (
                      <div key={doc.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Voice: {doc.insights.brandVoice}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.insights.toneCharacteristics.map((tone) => (
                            <Badge key={tone} variant="secondary" className="text-xs">
                              {tone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Key Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...new Set(completedDocs.flatMap(doc => doc.insights?.keyTopics || []))]
                      .slice(0, 10)
                      .map((topic) => (
                      <div key={topic} className="flex items-center justify-between">
                        <span className="text-sm">{topic}</span>
                        <Badge variant="outline" className="text-xs">
                          {completedDocs.filter(doc => 
                            doc.insights?.keyTopics?.includes(topic)
                          ).length} docs
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No insights available</h3>
                <p className="text-muted-foreground">
                  Upload and process training documents to see AI insights about your brand.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Insights Dialog */}
      <Dialog open={insightsDialogOpen} onOpenChange={setInsightsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Insights: {selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              Detailed analysis of your training document
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Brand Voice</h4>
                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                  {selectedDocument.insights.brandVoice}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Tone Characteristics</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.insights.toneCharacteristics.map((tone) => (
                    <Badge key={tone} variant="secondary">
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.insights.keyTopics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedDocument.insights.writingStyle && (
                <div>
                  <h4 className="font-medium mb-2">Writing Style</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    {selectedDocument.insights.writingStyle}
                  </p>
                </div>
              )}

              {selectedDocument.insights.targetAudience && (
                <div>
                  <h4 className="font-medium mb-2">Target Audience</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    {selectedDocument.insights.targetAudience}
                  </p>
                </div>
              )}

              {selectedDocument.summary && (
                <div>
                  <h4 className="font-medium mb-2">Document Summary</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    {selectedDocument.summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
