"use client"

import { useState, useEffect } from "react"
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Eye,
  MousePointer,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Mail,
  Speaker
} from "lucide-react"

// Sample data for charts
const performanceData = [
  { name: 'Mon', followers: 4000, engagement: 2400, reach: 8000 },
  { name: 'Tue', followers: 3000, engagement: 1398, reach: 7500 },
  { name: 'Wed', followers: 2000, engagement: 9800, reach: 9000 },
  { name: 'Thu', followers: 2780, engagement: 3908, reach: 8200 },
  { name: 'Fri', followers: 1890, engagement: 4800, reach: 9500 },
  { name: 'Sat', followers: 2390, engagement: 3800, reach: 10000 },
  { name: 'Sun', followers: 3490, engagement: 4300, reach: 11000 }
]

const platformData = [
  { name: 'Instagram', value: 35, color: '#E4405F' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'Twitter', value: 20, color: '#1DA1F2' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' },
  { name: 'TikTok', value: 5, color: '#000000' }
]

const engagementTrends = [
  { month: 'Jan', likes: 1200, comments: 450, shares: 200 },
  { month: 'Feb', likes: 1350, comments: 520, shares: 280 },
  { month: 'Mar', likes: 1500, comments: 680, shares: 350 },
  { month: 'Apr', likes: 1800, comments: 750, shares: 420 },
  { month: 'May', likes: 2100, comments: 890, shares: 500 },
  { month: 'Jun', likes: 2400, comments: 950, shares: 580 }
]

const topPosts = [
  {
    id: 1,
    content: "Behind the scenes of our latest project! 🎬",
    platform: "instagram",
    engagement: 2840,
    reach: 15000,
    clicks: 450,
    image: "/placeholder.jpg"
  },
  {
    id: 2,
    content: "Tips for social media success in 2024 📈",
    platform: "linkedin",
    engagement: 1950,
    reach: 8500,
    clicks: 320,
    image: null
  },
  {
    id: 3,
    content: "Customer success story spotlight! 🌟",
    platform: "facebook",
    engagement: 1680,
    reach: 12000,
    clicks: 280,
    image: "/woman-portrait.png"
  }
]

interface AnalyticsReport {
  id: string
  title: string
  period: string
  generatedAt: string
  type: 'weekly' | 'monthly' | 'custom'
  format: 'pdf' | 'email' | 'voice'
  status: 'ready' | 'generating' | 'scheduled'
}

const sampleReports: AnalyticsReport[] = [
  {
    id: "1",
    title: "Weekly Performance Report",
    period: "June 10-16, 2024",
    generatedAt: "2 hours ago",
    type: "weekly",
    format: "pdf",
    status: "ready"
  },
  {
    id: "2",
    title: "Monthly Analytics Summary",
    period: "May 2024",
    generatedAt: "1 day ago",
    type: "monthly",
    format: "email",
    status: "ready"
  },
  {
    id: "3",
    title: "Campaign Performance Voice Brief",
    period: "Q2 2024",
    generatedAt: "3 days ago",
    type: "custom",
    format: "voice",
    status: "ready"
  }
]

export default function AnalyticsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [dateRange, setDateRange] = useState("7d")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reports, setReports] = useState<AnalyticsReport[]>(sampleReports)

  const generateReport = async (type: 'pdf' | 'email' | 'voice') => {
    setIsGeneratingReport(true)
    
    try {
      const response = await fetch('/api/analytics/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          platform: selectedPlatform,
          dateRange,
          format: type
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        if (type === 'voice') {
          // Play the generated voice report
          const audio = new Audio(result.audioUrl)
          audio.play()
        } else if (type === 'pdf') {
          // Download PDF
          window.open(result.downloadUrl, '_blank')
        }
        
        // Add to reports list
        const newReport: AnalyticsReport = {
          id: Date.now().toString(),
          title: `${type.toUpperCase()} Report`,
          period: `${dateRange} period`,
          generatedAt: "Just now",
          type: "custom",
          format: type,
          status: "ready"
        }
        
        setReports(prev => [newReport, ...prev])
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Deep insights into your social media performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">47,392</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
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
                <p className="text-2xl font-bold">8.4%</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">+2.1%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">284K</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">-3.2%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click-through Rate</p>
                <p className="text-2xl font-bold">4.2%</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">+0.8%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="reports">AI Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="reach" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={engagementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} />
                  <Bar dataKey="comments" fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} />
                  <Bar dataKey="shares" fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Age 18-24</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Age 25-34</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Age 35-44</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Age 45+</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">United States</span>
                  <Badge variant="secondary">35.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">United Kingdom</span>
                  <Badge variant="secondary">18.7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Canada</span>
                  <Badge variant="secondary">12.4%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Australia</span>
                  <Badge variant="secondary">8.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Germany</span>
                  <Badge variant="secondary">6.3%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post) => (
                    <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.engagement}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.reach}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MousePointer className="w-4 h-4" />
                            <span>{post.clicks}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">Video</p>
                    <p className="text-sm text-muted-foreground">Best performing format</p>
                    <p className="text-xs text-muted-foreground">+45% engagement vs images</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">9 AM</p>
                    <p className="text-sm text-muted-foreground">Optimal posting time</p>
                    <p className="text-xs text-muted-foreground">Peak audience activity</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">#trending</p>
                    <p className="text-sm text-muted-foreground">Top hashtag</p>
                    <p className="text-xs text-muted-foreground">2.3M impressions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generate Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Generate AI Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive reports with AI insights and recommendations
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => generateReport('pdf')}
                    disabled={isGeneratingReport}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate PDF Report
                  </Button>
                  
                  <Button
                    onClick={() => generateReport('email')}
                    disabled={isGeneratingReport}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Report to Client
                  </Button>
                  
                  <Button
                    onClick={() => generateReport('voice')}
                    disabled={isGeneratingReport}
                    className="w-full justify-start bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Speaker className="w-4 h-4 mr-2" />
                    Generate Voice Report
                  </Button>
                </div>
                
                {isGeneratingReport && (
                  <div className="text-center p-4">
                    <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Generating AI report...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          {report.format === 'voice' ? (
                            <Speaker className="w-4 h-4 text-orange-600" />
                          ) : report.format === 'email' ? (
                            <Mail className="w-4 h-4 text-orange-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{report.title}</p>
                          <p className="text-xs text-muted-foreground">{report.period}</p>
                          <p className="text-xs text-muted-foreground">{report.generatedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={report.status === 'ready' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {report.status}
                        </Badge>
                        {report.status === 'ready' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-blue-700">
                  Your video content performs 45% better than images. Consider increasing video posts from 2 to 4 per week to maximize engagement.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Optimal Timing</h4>
                <p className="text-sm text-green-700">
                  Your audience is most active on Tuesdays and Thursdays at 9 AM EST. Scheduling posts during these times could increase reach by 23%.
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">💡 Content Suggestion</h4>
                <p className="text-sm text-orange-700">
                  Behind-the-scenes content generates 67% more engagement than product showcases. Try sharing more process-focused content.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
