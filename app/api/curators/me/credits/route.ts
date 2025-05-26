import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-debug-helper"

export async function PATCH(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser()

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const curatorId = user.id
    const data = await request.json()

    // First, get the current curator data
    const getResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${curatorId}`)

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch curator: ${getResponse.status}`)
    }

    const curator = await getResponse.json()

    // Prepare the update data
    const updateData: Record<string, any> = {}

    // If credits_increment is provided, calculate the new value
    if (data.credits_increment) {
      updateData.credits = (curator.credits || 0) + data.credits_increment
    }

    // If accepted_increment is provided, calculate the new value
    if (data.accepted_increment) {
      updateData.accepted = (curator.accepted || 0) + data.accepted_increment
    }

    // Update curator in the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${curatorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update curator: ${response.status}`)
    }

    const updatedCurator = await response.json()
    return NextResponse.json(updatedCurator)
  } catch (error) {
    console.error("Error updating curator credits:", error)
    return NextResponse.json({ error: "Failed to update curator credits" }, { status: 500 })
  }
}
