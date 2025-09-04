import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const workflowData = await request.json()

    // Create workflow in database
    const workflow = {
      id: Date.now().toString(),
      ...workflowData,
      status: 'draft',
      executions: 0,
      lastRun: null,
      createdAt: new Date().toISOString(),
      steps: generateWorkflowSteps(workflowData)
    }

    // In real implementation, save to database
    console.log('Creating workflow:', workflow)

    return NextResponse.json({
      success: true,
      workflow
    })

  } catch (error) {
    console.error('Workflow creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}

function generateWorkflowSteps(workflowData: any) {
  const { trigger, template } = workflowData

  // Generate default steps based on trigger type
  switch (trigger) {
    case 'whatsapp':
      return [
        {
          id: "1",
          type: "trigger",
          name: "WhatsApp Message Received",
          description: "Trigger when client sends message",
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
          type: "action",
          name: "Schedule Post",
          description: "Schedule approved content via Buffer",
          config: { platform: "all", time: "optimal" }
        }
      ]

    case 'schedule':
      return [
        {
          id: "1",
          type: "trigger",
          name: "Scheduled Trigger",
          description: "Run on schedule",
          config: { schedule: "0 9 * * 1" }
        },
        {
          id: "2",
          type: "action",
          name: "Collect Data",
          description: "Gather performance data",
          config: { period: "7d" }
        },
        {
          id: "3",
          type: "action",
          name: "Generate Report",
          description: "Create analytics report",
          config: { format: "email" }
        }
      ]

    case 'mention':
      return [
        {
          id: "1",
          type: "trigger",
          name: "New Mention/Comment",
          description: "Trigger on social media mentions",
          config: { platforms: "all" }
        },
        {
          id: "2",
          type: "condition",
          name: "Sentiment Analysis",
          description: "Analyze sentiment of mention",
          config: { minConfidence: 0.8 }
        },
        {
          id: "3",
          type: "action",
          name: "AI Response",
          description: "Generate appropriate response",
          config: { tone: "professional" }
        }
      ]

    default:
      return []
  }
}
