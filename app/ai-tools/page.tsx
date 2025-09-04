"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Brain, 
  Wand2, 
  FileText, 
  Image, 
  Hash, 
  Clock, 
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  RefreshCw,
  Copy,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from "lucide-react"

interface AITool {
  id: string
  name: string
  description: string
  icon: any
  category: 'content' | 'analysis' | 'optimization' | 'research'
  premium?: boolean
}

const aiTools: AITool[] = [
  {
    id: 'caption-generator',
    name: 'Caption Generator',
    description: 'Generate engaging captions for your social media posts',
    icon: FileText,
    category: 'content'
  },
  {
    id: 'hashtag-research',
    name: 'Hashtag Research',
    description: 'Find trending and relevant hashtags for maximum reach',
    icon: Hash,
    category: 'research'
  },
  {
    id: 'content-ideas',
    name: 'Content Ideas',
    description: 'Get creative content ideas based on trending topics',
    icon: Lightbulb,
    category: 'content'
  },
  {
    id: 'audience-insights',
    name: 'Audience Analysis',
    description: 'Deep dive into your audience behavior and preferences',
    icon: Users,
    category: 'analysis',
    premium: true
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Analyze competitor strategies and find opportunities',
    icon: Target,
    category: 'analysis',
    premium: true
  },
  {
    id: 'optimal-timing',
    name: 'Optimal Timing',
    description: 'Find the best times to post for maximum engagement',
    icon: Clock,
    category: 'optimization'
  },
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Create stunning images for your social media posts',
    icon: Image,
    category: 'content',
    premium: true
  },
  {
    id: 'trend-predictor',
    name: 'Trend Predictor',
    description: 'Predict upcoming trends in your industry',
    icon: TrendingUp,
    category: 'research',
    premium: true
  }
]

interface GeneratedContent {
  id: string
  type: string
  content: string
  platform?: string
  metadata?: any
  rating?: number
  timestamp: string
}

export default function AIToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [inputText, setInputText] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTools = aiTools.filter(tool => 
    selectedCategory === "all" || tool.category === selectedCategory
  )

  const generateContent = async (toolId: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: toolId,
          input: inputText,
          platform: selectedPlatform,
          tone: selectedTone,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        const newContent: GeneratedContent = {
          id: Date.now().toString(),
          type: toolId,
          content: result.content,
          platform: selectedPlatform,
          metadata: result.metadata,
          timestamp: new Date().toISOString()
        }
        
        setGeneratedContent(prev => [newContent, ...prev])
        setInputText("")
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const rateContent = (contentId: string, rating: number) => {
    setGeneratedContent(prev => prev.map(content => 
      content.id === contentId ? { ...content, rating } : content
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getToolIcon = (IconComponent: any) => {
    return <IconComponent className="w-6 h-6" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Tools Hub</h1>
          <p className="text-muted-foreground">
            Supercharge your content creation with AI-powered tools
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="content">Content Creation</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTool === tool.id ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => setSelectedTool(tool.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  {getToolIcon(tool.icon)}
                </div>
                {tool.premium && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold mb-2">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Tool Interface */}
      {selectedTool && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-orange-500" />
              <span>{aiTools.find(t => t.id === selectedTool)?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Input</label>
                  <Textarea
                    placeholder={
                      selectedTool === 'caption-generator' ? 'Describe your post or product...' :
                      selectedTool === 'hashtag-research' ? 'Enter your topic or niche...' :
                      selectedTool === 'content-ideas' ? 'Enter your industry or topic...' :
                      'Enter your query...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform</label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tone</label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => generateContent(selectedTool)}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>

              {/* Preview/Output Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Generated Content</label>
                <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-2 text-orange-500" />
                        <p className="text-sm text-muted-foreground">AI is working its magic...</p>
                      </div>
                    </div>
                  ) : generatedContent.length > 0 ? (
                    <div className="space-y-3">
                      {generatedContent.slice(0, 3).map((content) => (
                        <div key={content.id} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {content.type.replace('-', ' ')}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(content.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => rateContent(content.id, 1)}
                                  className={content.rating === 1 ? 'text-green-500' : ''}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => rateContent(content.id, -1)}
                                  className={content.rating === -1 ? 'text-red-500' : ''}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{content.content}</p>
                          {content.metadata && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Platform: {content.platform} • {new Date(content.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <Wand2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          Generated content will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Generations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {generatedContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.map((content) => (
                <Card key={content.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {content.type.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{content.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Platform: {content.platform}</span>
                      <span>{new Date(content.timestamp).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No content generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Select an AI tool above to start generating content
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground">
                Mark your best generated content as favorites to easily find them later
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Product Launch",
                description: "Template for announcing new products",
                platform: "Instagram",
                category: "Marketing"
              },
              {
                title: "Behind the Scenes",
                description: "Show your team and process",
                platform: "All Platforms",
                category: "Engagement"
              },
              {
                title: "Customer Testimonial",
                description: "Showcase customer success stories",
                platform: "LinkedIn",
                category: "Social Proof"
              }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{template.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{template.platform}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
