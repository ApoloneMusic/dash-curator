import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await request.json()

  try {
    // Update pitch in the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pitches/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update pitch: ${response.status}`)
    }

    const updatedPitch = await response.json()
    return NextResponse.json(updatedPitch)
  } catch (error) {
    console.error(`Error updating pitch ${id}:`, error)
    return NextResponse.json({ error: "Failed to update pitch" }, { status: 500 })
  }
}
