"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import {
  Users,
  TrendingUp,
  MessageCircle,
  Calendar,
  Zap,
  Brain,
  Settings,
  Bell,
  Plus,
  Eye,
  ThumbsUp,
  Share2,
  BarChart3,
  Activity
} from "lucide-react"

// Mock data
const analyticsData = [
  { month: "Jan", engagement: 45, followers: 580, posts: 12 },
  { month: "Feb", engagement: 52, followers: 680, posts: 15 },
  { month: "Mar", engagement: 48, followers: 720, posts: 18 },
  { month: "Apr", engagement: 61, followers: 890, posts: 22 },
  { month: "May", engagement: 55, followers: 1200, posts: 25 },
  { month: "Jun", engagement: 67, followers: 980, posts: 20 }
]

const platformData = [
  { name: "Instagram", value: 35, color: "#E4405F" },
  { name: "Facebook", value: 25, color: "#1877F2" },
  { name: "Twitter", value: 20, color: "#1DA1F2" },
  { name: "LinkedIn", value: 15, color: "#0A66C2" },
  { name: "TikTok", value: 5, color: "#000000" }
]

const recentPosts = [
  {
    id: 1,
    platform: "Instagram",
    content: "Beautiful sunset at the beach 🌅 #nature #photography",
    status: "published",
    engagement: 89,
    date: "2 hours ago",
    metrics: { likes: 245, comments: 18, shares: 12 }
  },
  {
    id: 2,
    platform: "Facebook",
    content: "Excited to share our latest product update! 🚀",
    status: "scheduled",
    engagement: 0,
    date: "Tomorrow at 2 PM",
    metrics: { likes: 0, comments: 0, shares: 0 }
  },
  {
    id: 3,
    platform: "LinkedIn",
    content: "5 tips for better work-life balance in remote work",
    status: "published",
    engagement: 76,
    date: "1 day ago",
    metrics: { likes: 128, comments: 24, shares: 31 }
  }
]

const aiSuggestions = [
  "Create content about 'Sustainable living tips' - trending 📈",
  "Post inspiration quotes on Monday mornings for better engagement",
  "Share behind-the-scenes content - your audience loves authenticity",
  "Create carousel posts - they get 3x more engagement than single images"
]

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold">Postpilot AI</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card min-h-screen p-6">
          <nav className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Overview
            </div>
            <Button variant="ghost" className="w-full justify-start bg-accent">
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Content Calendar
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-3" />
              Engagement Hub
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-3" />
              Analytics
            </Button>
            
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 mt-8">
              AI Tools
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Brain className="w-4 h-4 mr-3" />
              Content Generator
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-3" />
              Automation
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-3" />
              Trends Analysis
            </Button>

            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 mt-8">
              Management
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Clients
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                    <p className="text-3xl font-bold">12.4K</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                    <p className="text-3xl font-bold">8.7%</p>
                    <p className="text-xs text-green-600">+3.2% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Posts This Month</p>
                    <p className="text-3xl font-bold">47</p>
                    <p className="text-xs text-orange-600">+8 from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Credits Used</p>
                    <p className="text-3xl font-bold">73</p>
                    <p className="text-xs text-muted-foreground">of 500 available</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Overview</CardTitle>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7d</SelectItem>
                      <SelectItem value="30d">30d</SelectItem>
                      <SelectItem value="90d">90d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {platformData.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="text-sm">{platform.name}</span>
                      </div>
                      <span className="text-sm font-medium">{platform.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts & AI Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        {post.status === 'published' && (
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {post.metrics.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {post.metrics.comments}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="w-3 h-3 mr-1" />
                              {post.metrics.shares}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm mb-3">{suggestion}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="w-3 h-3 mr-1" />
                          Create
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
