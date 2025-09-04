"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Brain, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"

interface Workflow {
  id: string
  name: string
  trigger: string
  status: 'active' | 'paused' | 'draft'
  executions: number
  lastRun: string
  description: string
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition'
  name: string
  description: string
  config: Record<string, any>
}

const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "WhatsApp Content Request",
    trigger: "WhatsApp Message",
    status: "active",
    executions: 147,
    lastRun: "2 hours ago",
    description: "Client sends message → AI generates content → Client approves → Schedule post",
    steps: [
      {
        id: "1",
        type: "trigger",
        name: "WhatsApp Message Received",
        description: "Trigger when client sends message with keyword 'post'",
        config: { keyword: "post", clientId: "all" }
      },
      {
        id: "2",
        type: "action",
        name: "AI Content Generation",
        description: "Generate post content based on message",
        config: { model: "gpt-4", tone: "professional" }
      },
      {
        id: "3",
        type: "action",
        name: "Send Approval Request",
        description: "Send generated content to client for approval",
        config: { timeout: "24h" }
      },
      {
        id: "4",
        type: "condition",
        name: "Check Approval",
        description: "Wait for client approval or rejection",
        config: { approvalRequired: true }
      },
      {
        id: "5",
        type: "action",
        name: "Schedule Post",
        description: "Schedule approved content via Buffer",
        config: { platform: "all", time: "optimal" }
      }
    ]
  },
  {
    id: "2",
    name: "Weekly Performance Report",
    trigger: "Schedule",
    status: "active",
    executions: 24,
    lastRun: "3 days ago",
    description: "Generate and send weekly performance reports to clients",
    steps: [
      {
        id: "1",
        type: "trigger",
        name: "Weekly Schedule",
        description: "Trigger every Monday at 9 AM",
        config: { schedule: "0 9 * * 1" }
      },
      {
        id: "2",
        type: "action",
        name: "Collect Analytics",
        description: "Gather performance data from all platforms",
        config: { period: "7d", platforms: ["instagram", "facebook", "twitter"] }
      },
      {
        id: "3",
        type: "action",
        name: "AI Report Generation",
        description: "Generate insights and recommendations",
        config: { includeVoice: true, language: "en" }
      },
      {
        id: "4",
        type: "action",
        name: "Send Report",
        description: "Send report via WhatsApp and email",
        config: { channels: ["whatsapp", "email"] }
      }
    ]
  },
  {
    id: "3",
    name: "Engagement Response",
    trigger: "Mention/Comment",
    status: "paused",
    executions: 89,
    lastRun: "1 day ago",
    description: "Auto-respond to mentions and comments with AI",
    steps: [
      {
        id: "1",
        type: "trigger",
        name: "New Mention/Comment",
        description: "Trigger on new mentions or comments",
        config: { platforms: "all", sentiment: "neutral_positive" }
      },
      {
        id: "2",
        type: "condition",
        name: "Sentiment Analysis",
        description: "Analyze sentiment and intent",
        config: { minConfidence: 0.8 }
      },
      {
        id: "3",
        type: "action",
        name: "AI Response",
        description: "Generate contextual response",
        config: { maxLength: 280, tone: "friendly" }
      },
      {
        id: "4",
        type: "action",
        name: "Post Response",
        description: "Automatically post response or request approval",
        config: { autoPost: false }
      }
    ]
  }
]

const workflowTemplates = [
  {
    id: "content-request",
    name: "Content Request Workflow",
    description: "Client requests content via WhatsApp → AI generates → Approval → Scheduling",
    category: "Content Creation",
    trigger: "WhatsApp Message"
  },
  {
    id: "performance-alert",
    name: "Performance Alert",
    description: "Monitor metrics and alert when goals are met or issues arise",
    category: "Analytics",
    trigger: "Performance Threshold"
  },
  {
    id: "competitor-monitoring",
    name: "Competitor Monitoring",
    description: "Track competitor content and suggest response strategies",
    category: "Competitive Intelligence",
    trigger: "Competitor Post"
  },
  {
    id: "crisis-management",
    name: "Crisis Management",
    description: "Detect negative sentiment and escalate to team",
    category: "Reputation Management",
    trigger: "Negative Sentiment"
  },
  {
    id: "lead-nurturing",
    name: "Lead Nurturing",
    description: "Follow up with engaged users and convert to leads",
    category: "Lead Generation",
    trigger: "High Engagement"
  }
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "",
    template: ""
  })

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' }
        : workflow
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap className="w-4 h-4" />
      case 'action': return <Play className="w-4 h-4" />
      case 'condition': return <AlertCircle className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const createWorkflow = async () => {
    try {
      const response = await fetch('/api/automation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkflow),
      })

      if (response.ok) {
        const workflow = await response.json()
        setWorkflows(prev => [...prev, workflow])
        setIsCreating(false)
        setNewWorkflow({ name: "", description: "", trigger: "", template: "" })
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Hub</h1>
          <p className="text-muted-foreground">
            Create intelligent workflows to automate your social media management
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
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
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Executions Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Brain className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45h</p>
                <p className="text-sm text-muted-foreground">Time Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          {/* Workflows List */}
          <div className="grid grid-cols-1 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflow(workflow.id)}
                      >
                        {workflow.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Workflow Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{workflow.executions}</p>
                        <p className="text-xs text-muted-foreground">Total Executions</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{workflow.trigger}</p>
                        <p className="text-xs text-muted-foreground">Trigger</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{workflow.lastRun}</p>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                      </div>
                    </div>

                    {/* Workflow Steps */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Workflow Steps:</p>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 bg-muted p-2 rounded-lg whitespace-nowrap">
                              {getStepIcon(step.type)}
                              <span className="text-xs font-medium">{step.name}</span>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <div className="w-8 h-px bg-border"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedWorkflow(workflow.id)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Run
                      </Button>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Trigger: {template.trigger}
                    </div>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Execution Log Entries */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">WhatsApp Content Request</p>
                      <p className="text-sm text-muted-foreground">Completed in 2.3s</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">2 minutes ago</p>
                    <p className="text-xs text-muted-foreground">Client: @sarah_marketing</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Weekly Performance Report</p>
                      <p className="text-sm text-muted-foreground">Completed in 15.7s</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">1 hour ago</p>
                    <p className="text-xs text-muted-foreground">Reports sent to 5 clients</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">Engagement Response</p>
                      <p className="text-sm text-muted-foreground">Failed - API limit reached</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">3 hours ago</p>
                    <p className="text-xs text-muted-foreground">Retry in 1 hour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Workflow Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workflow Name</label>
                <Input
                  placeholder="Enter workflow name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what this workflow does"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Trigger Type</label>
                <Select value={newWorkflow.trigger} onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, trigger: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp Message</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="mention">Mention/Comment</SelectItem>
                    <SelectItem value="performance">Performance Threshold</SelectItem>
                    <SelectItem value="engagement">High Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Template (Optional)</label>
                <Select value={newWorkflow.template} onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start from template" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={createWorkflow} className="bg-orange-500 hover:bg-orange-600">
                  Create Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
