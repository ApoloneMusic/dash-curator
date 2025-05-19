import { NextResponse } from "next/server"

// Define the interface for the feedback data
export interface FeedbackData {
  pitchId: number
  campaignId: number
  curatorId: number
  mainReason: string
  recordingQuality: number
  productionQuality: number
  originality: number
  comments?: string
  createdAt: string
  trackName: string
  artistName: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackData

    // Validate the request body
    if (!body.pitchId || !body.curatorId || !body.mainReason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log the feedback data for debugging
    console.log("Storing feedback:", body)

    // In a real application, you would store this data in your database
    // For example, using a database client:
    // const result = await db.insert('feedback').values(body).returning()

    // For now, we'll simulate a successful database operation
    const mockDbResponse = {
      id: Math.floor(Math.random() * 1000),
      ...body,
    }

    // Return a success response with the created feedback
    return NextResponse.json({
      success: true,
      data: mockDbResponse,
      message: "Feedback stored successfully",
    })
  } catch (error) {
    console.error("Error storing feedback:", error)
    return NextResponse.json(
      {
        error: "Failed to store feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
