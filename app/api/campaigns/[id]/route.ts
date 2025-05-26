import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await request.json()

  try {
    // First, get the current campaign to calculate the new accepted_count
    const getResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${id}`)

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch campaign: ${getResponse.status}`)
    }

    const campaign = await getResponse.json()

    // Prepare the update data
    const updateData = {
      ...data,
    }

    // If accepted_count_increment is provided, calculate the new value
    if (data.accepted_count_increment) {
      updateData.accepted_count = (campaign.accepted_count || 0) + data.accepted_count_increment
      delete updateData.accepted_count_increment
    }

    // Update campaign in the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update campaign: ${response.status}`)
    }

    const updatedCampaign = await response.json()
    return NextResponse.json(updatedCampaign)
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error)
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}
