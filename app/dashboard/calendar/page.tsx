"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Calendar as CalendarIcon,
  Plus,
  Brain,
  Image,
  Video,
  FileText,
  Clock,
  Send,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react"
import { format } from "date-fns"

const scheduledPosts = [
  {
    id: 1,
    platform: "Instagram",
    content: "Beautiful sunset at the beach 🌅 #nature #photography #sunset",
    mediaUrl: "/woman-sunglasses.png",
    scheduledAt: new Date(2025, 7, 31, 14, 0),
    status: "scheduled",
    aiGenerated: true
  },
  {
    id: 2,
    platform: "Facebook",
    content: "Excited to share our latest product update! 🚀 #innovation #tech",
    mediaUrl: null,
    scheduledAt: new Date(2025, 8, 1, 10, 30),
    status: "scheduled",
    aiGenerated: false
  },
  {
    id: 3,
    platform: "LinkedIn",
    content: "5 essential tips for remote work productivity that actually work...",
    mediaUrl: "/thoughtful-man.png",
    scheduledAt: new Date(2025, 8, 2, 9, 0),
    status: "pending_approval",
    aiGenerated: true
  }
]

export default function ContentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    platform: "",
    content: "",
    mediaUrl: "",
    scheduledAt: new Date(),
    useAI: false
  })

  const handleCreatePost = async () => {
    if (newPost.useAI) {
      // Generate AI content
      const aiContent = await generateAIContent(newPost.content, newPost.platform)
      setNewPost(prev => ({ ...prev, content: aiContent }))
    }
    
    // Add post to schedule
    console.log("Creating post:", newPost)
    setIsCreatePostOpen(false)
    
    // Reset form
    setNewPost({
      platform: "",
      content: "",
      mediaUrl: "",
      scheduledAt: new Date(),
      useAI: false
    })
  }

  const generateAIContent = async (prompt: string, platform: string) => {
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform })
      })
      const data = await response.json()
      return data.caption
    } catch (error) {
      console.error('Error generating AI content:', error)
      return prompt
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800'
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-pink-100 text-pink-800'
      case 'Facebook': return 'bg-blue-100 text-blue-800'
      case 'LinkedIn': return 'bg-blue-100 text-blue-800'
      case 'Twitter': return 'bg-sky-100 text-sky-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <p className="text-muted-foreground">Plan, schedule, and manage your social media content</p>
          </div>
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newPost.platform} onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-ai"
                    checked={newPost.useAI}
                    onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, useAI: checked }))}
                  />
                  <Label htmlFor="use-ai" className="flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    Use AI to enhance content
                  </Label>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder={newPost.useAI ? "Describe what you want to post about..." : "Write your post content..."}
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="media">Media URL (optional)</Label>
                  <Input
                    id="media"
                    placeholder="https://example.com/image.jpg"
                    value={newPost.mediaUrl}
                    onChange={(e) => setNewPost(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Schedule Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newPost.scheduledAt, "PPP 'at' p")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newPost.scheduledAt}
                        onSelect={(date) => date && setNewPost(prev => ({ ...prev, scheduledAt: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatePostOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={!newPost.platform || !newPost.content}
                  >
                    {newPost.useAI ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate & Schedule
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={getPlatformColor(post.platform)}>
                          {post.platform}
                        </Badge>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status.replace('_', ' ')}
                        </Badge>
                        {post.aiGenerated && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            <Brain className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      {post.mediaUrl && (
                        <img
                          src={post.mediaUrl}
                          alt="Post media"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(post.scheduledAt, "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>

                    {post.status === 'pending_approval' && (
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Content Generator</h3>
              <p className="text-sm text-muted-foreground">Generate engaging content with AI</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Bulk Scheduler</h3>
              <p className="text-sm text-muted-foreground">Schedule multiple posts at once</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Content Templates</h3>
              <p className="text-sm text-muted-foreground">Use pre-made templates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
