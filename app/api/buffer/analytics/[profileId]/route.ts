import { NextRequest, NextResponse } from 'next/server'
import BufferAPIService from '@/lib/buffer-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const bufferService = new BufferAPIService()
    const analytics = await bufferService.getAnalytics(
      params.profileId,
      startDate || undefined,
      endDate || undefined
    )

    return NextResponse.json({
      analytics,
      success: true
    })
  } catch (error) {
    console.error('Error fetching Buffer analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
