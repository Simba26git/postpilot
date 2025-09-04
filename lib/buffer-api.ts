import axios from 'axios'

export interface BufferProfile {
  id: string
  service: string
  username: string
  avatar: string
}

export interface BufferPost {
  id: string
  text: string
  media?: {
    link: string
    description?: string
  }
  scheduled_at?: string
  status: 'buffer' | 'sent' | 'failed'
}

class BufferAPIService {
  private accessToken: string
  private baseURL = 'https://api.bufferapp.com/1'

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.BUFFER_ACCESS_TOKEN || ''
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    }
  }

  async getProfiles(): Promise<BufferProfile[]> {
    try {
      const response = await axios.get(`${this.baseURL}/profiles.json`, {
        headers: this.getHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error fetching Buffer profiles:', error)
      throw new Error('Failed to fetch Buffer profiles')
    }
  }

  async createPost(profileId: string, postData: {
    text: string
    media?: string[]
    scheduled_at?: string
    now?: boolean
  }): Promise<BufferPost> {
    try {
      const payload: any = {
        text: postData.text,
        profile_ids: [profileId]
      }

      if (postData.media && postData.media.length > 0) {
        payload.media = {
          link: postData.media[0],
          description: postData.text
        }
      }

      if (postData.scheduled_at) {
        payload.scheduled_at = postData.scheduled_at
      }

      if (postData.now) {
        payload.now = true
      }

      const response = await axios.post(`${this.baseURL}/updates/create.json`, payload, {
        headers: this.getHeaders()
      })

      return response.data
    } catch (error) {
      console.error('Error creating Buffer post:', error)
      throw new Error('Failed to create Buffer post')
    }
  }

  async getPost(postId: string): Promise<BufferPost> {
    try {
      const response = await axios.get(`${this.baseURL}/updates/${postId}.json`, {
        headers: this.getHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error fetching Buffer post:', error)
      throw new Error('Failed to fetch Buffer post')
    }
  }

  async updatePost(postId: string, updateData: {
    text?: string
    scheduled_at?: string
  }): Promise<BufferPost> {
    try {
      const response = await axios.post(`${this.baseURL}/updates/${postId}/update.json`, updateData, {
        headers: this.getHeaders()
      })
      return response.data
    } catch (error) {
      console.error('Error updating Buffer post:', error)
      throw new Error('Failed to update Buffer post')
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      await axios.post(`${this.baseURL}/updates/${postId}/destroy.json`, {}, {
        headers: this.getHeaders()
      })
      return true
    } catch (error) {
      console.error('Error deleting Buffer post:', error)
      throw new Error('Failed to delete Buffer post')
    }
  }

  async getProfilePosts(profileId: string, count: number = 50): Promise<BufferPost[]> {
    try {
      const response = await axios.get(`${this.baseURL}/profiles/${profileId}/updates/pending.json`, {
        headers: this.getHeaders(),
        params: { count }
      })
      return response.data.updates || []
    } catch (error) {
      console.error('Error fetching profile posts:', error)
      throw new Error('Failed to fetch profile posts')
    }
  }

  async getAnalytics(profileId: string, startDate?: string, endDate?: string) {
    try {
      const params: any = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      const response = await axios.get(`${this.baseURL}/profiles/${profileId}/analytics.json`, {
        headers: this.getHeaders(),
        params
      })
      return response.data
    } catch (error) {
      console.error('Error fetching Buffer analytics:', error)
      throw new Error('Failed to fetch Buffer analytics')
    }
  }

  async schedulePost(profileId: string, text: string, scheduledAt: Date, media?: string[]) {
    return this.createPost(profileId, {
      text,
      media,
      scheduled_at: scheduledAt.toISOString()
    })
  }

  async publishNow(profileId: string, text: string, media?: string[]) {
    return this.createPost(profileId, {
      text,
      media,
      now: true
    })
  }
}

export default BufferAPIService
