import { NextRequest, NextResponse } from 'next/server'
import BufferAPIService from '@/lib/buffer-api'

export async function GET(request: NextRequest) {
  try {
    const bufferService = new BufferAPIService()
    const profiles = await bufferService.getProfiles()

    return NextResponse.json({
      profiles,
      success: true
    })
  } catch (error) {
    console.error('Error fetching Buffer profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId, text, media, scheduledAt, publishNow } = await request.json()

    if (!profileId || !text) {
      return NextResponse.json(
        { error: 'Profile ID and text are required' },
        { status: 400 }
      )
    }

    const bufferService = new BufferAPIService()
    
    let result
    if (publishNow) {
      result = await bufferService.publishNow(profileId, text, media)
    } else if (scheduledAt) {
      result = await bufferService.schedulePost(profileId, text, new Date(scheduledAt), media)
    } else {
      result = await bufferService.createPost(profileId, { text, media })
    }

    return NextResponse.json({
      post: result,
      success: true
    })
  } catch (error) {
    console.error('Error creating Buffer post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
