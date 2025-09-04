"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter, 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Trash2,
  Archive,
  Flag
} from "lucide-react"

interface EngagementItem {
  id: string
  type: 'comment' | 'mention' | 'dm' | 'review'
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
  content: string
  author: {
    name: string
    username: string
    avatar: string
    verified?: boolean
  }
  post?: {
    content: string
    image?: string
  }
  timestamp: string
  sentiment: 'positive' | 'neutral' | 'negative'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'responded' | 'ignored' | 'escalated'
  engagement: {
    likes: number
    replies: number
    shares: number
  }
  aiSuggestion?: string
}

const sampleEngagements: EngagementItem[] = [
  {
    id: "1",
    type: "comment",
    platform: "instagram",
    content: "Love this post! Where can I get more information about your services? 😍",
    author: {
      name: "Sarah Johnson",
      username: "sarah_designs",
      avatar: "/woman-portrait.png",
      verified: false
    },
    post: {
      content: "Check out our latest project showcase! 🎨",
      image: "/placeholder.jpg"
    },
    timestamp: "5 minutes ago",
    sentiment: "positive",
    priority: "high",
    status: "pending",
    engagement: { likes: 12, replies: 3, shares: 1 },
    aiSuggestion: "Hi Sarah! Thanks for the love! 😊 You can check out all our services at [website link] or DM us for a personalized consultation. We'd love to help with your next project! ✨"
  },
  {
    id: "2",
    type: "mention",
    platform: "twitter",
    content: "@your_brand This is exactly what I needed! Thanks for the amazing content 🙌",
    author: {
      name: "Mike Chen",
      username: "mike_dev",
      avatar: "/thoughtful-man.png",
      verified: true
    },
    timestamp: "12 minutes ago",
    sentiment: "positive",
    priority: "medium",
    status: "pending",
    engagement: { likes: 5, replies: 1, shares: 2 },
    aiSuggestion: "So glad we could help, Mike! 🙌 Thanks for the kind words. If you need anything else, don't hesitate to reach out!"
  },
  {
    id: "3",
    type: "dm",
    platform: "instagram",
    content: "Hi, I'm interested in your premium package. Can you send me more details?",
    author: {
      name: "Emma Wilson",
      username: "emma_marketing",
      avatar: "/woman-2.png"
    },
    timestamp: "20 minutes ago",
    sentiment: "neutral",
    priority: "high",
    status: "pending",
    engagement: { likes: 0, replies: 0, shares: 0 },
    aiSuggestion: "Hi Emma! Thanks for your interest in our premium package. I'd be happy to share more details. Our premium package includes [key features]. Would you like to schedule a quick call to discuss your specific needs?"
  },
  {
    id: "4",
    type: "comment",
    platform: "facebook",
    content: "I had a terrible experience with your service. Very disappointed.",
    author: {
      name: "John Smith",
      username: "john_smith_reviews",
      avatar: "/placeholder-user.jpg"
    },
    post: {
      content: "Customer success story spotlight! 🌟"
    },
    timestamp: "1 hour ago",
    sentiment: "negative",
    priority: "high",
    status: "escalated",
    engagement: { likes: 0, replies: 2, shares: 0 },
    aiSuggestion: "Hi John, I'm sorry to hear about your experience. This doesn't reflect our usual standards. Please DM us your details so we can resolve this immediately and make things right."
  },
  {
    id: "5",
    type: "review",
    platform: "linkedin",
    content: "Professional team with excellent results. Highly recommend their services!",
    author: {
      name: "Lisa Rodriguez",
      username: "lisa_ceo",
      avatar: "/woman-3.png",
      verified: true
    },
    timestamp: "2 hours ago",
    sentiment: "positive",
    priority: "medium",
    status: "responded",
    engagement: { likes: 8, replies: 1, shares: 3 },
    aiSuggestion: "Thank you so much for the wonderful review, Lisa! It means the world to us. We're thrilled we could deliver excellent results for your team. 🙏"
  }
]

export default function EngagementPage() {
  const [engagements, setEngagements] = useState<EngagementItem[]>(sampleEngagements)
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterSentiment, setFilterSentiment] = useState<string>("all")

  const filteredEngagements = engagements.filter(engagement => {
    const matchesSearch = engagement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engagement.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === "all" || 
                      (selectedTab === "pending" && engagement.status === "pending") ||
                      (selectedTab === "responded" && engagement.status === "responded") ||
                      (selectedTab === "priority" && engagement.priority === "high")
    const matchesPlatform = filterPlatform === "all" || engagement.platform === filterPlatform
    const matchesSentiment = filterSentiment === "all" || engagement.sentiment === filterSentiment

    return matchesSearch && matchesTab && matchesPlatform && matchesSentiment
  })

  const getPlatformIcon = (platform: string) => {
    // Platform icons would be imported from your icon library
    return <div className="w-4 h-4 bg-gray-300 rounded"></div>
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'responded': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ignored': return <Archive className="w-4 h-4 text-gray-500" />
      case 'escalated': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleReply = async (engagementId: string, useAI: boolean = false) => {
    const engagement = engagements.find(e => e.id === engagementId)
    if (!engagement) return

    const replyContent = useAI ? engagement.aiSuggestion || replyText : replyText

    try {
      const response = await fetch('/api/engagement/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagementId,
          platform: engagement.platform,
          content: replyContent,
          type: engagement.type
        }),
      })

      if (response.ok) {
        setEngagements(prev => prev.map(e => 
          e.id === engagementId 
            ? { ...e, status: 'responded' as const }
            : e
        ))
        setReplyText("")
        setSelectedEngagement(null)
      }
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  const markAsHandled = (engagementId: string, status: 'responded' | 'ignored' | 'escalated') => {
    setEngagements(prev => prev.map(e => 
      e.id === engagementId ? { ...e, status } : e
    ))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Engagement Hub</h1>
          <p className="text-muted-foreground">
            Manage all your social media interactions in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Responded Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search engagements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
        </select>
        <select
          value={filterSentiment}
          onChange={(e) => setFilterSentiment(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({engagements.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({engagements.filter(e => e.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="responded">Responded ({engagements.filter(e => e.status === 'responded').length})</TabsTrigger>
          <TabsTrigger value="priority">High Priority ({engagements.filter(e => e.priority === 'high').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredEngagements.map((engagement) => (
            <Card key={engagement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Author Avatar */}
                  <img
                    src={engagement.author.avatar}
                    alt={engagement.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{engagement.author.name}</h4>
                          <span className="text-sm text-muted-foreground">@{engagement.author.username}</span>
                          {engagement.author.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(engagement.platform)}
                          <Badge variant="outline" className="text-xs">
                            {engagement.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getSentimentColor(engagement.sentiment)}`}>
                          {engagement.sentiment}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(engagement.priority)}`}>
                          {engagement.priority}
                        </Badge>
                        {getStatusIcon(engagement.status)}
                      </div>
                    </div>

                    {/* Original Post (if comment) */}
                    {engagement.post && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Original post:</p>
                        <p className="text-sm font-medium">{engagement.post.content}</p>
                      </div>
                    )}

                    {/* Engagement Content */}
                    <div className="bg-background border rounded-lg p-4">
                      <p className="text-sm">{engagement.content}</p>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{engagement.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{engagement.engagement.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{engagement.engagement.shares}</span>
                        </div>
                        <span>{engagement.timestamp}</span>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    {engagement.aiSuggestion && engagement.status === 'pending' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-800">AI Suggested Response:</span>
                        </div>
                        <p className="text-sm text-blue-700">{engagement.aiSuggestion}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {engagement.status === 'pending' && (
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          onClick={() => setSelectedEngagement(engagement.id)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        {engagement.aiSuggestion && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReply(engagement.id, true)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Use AI Reply
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsHandled(engagement.id, 'ignored')}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </Button>
                        {engagement.sentiment === 'negative' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsHandled(engagement.id, 'escalated')}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Escalate
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Reply Modal */}
      {selectedEngagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Reply to Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedEngagement(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleReply(selectedEngagement)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
