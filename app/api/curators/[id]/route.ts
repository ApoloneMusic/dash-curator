import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Fetch curator data from the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/curators/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch curator: ${response.status}`)
    }

    const curator = await response.json()
    return NextResponse.json(curator)
  } catch (error) {
    console.error(`Error fetching curator ${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch curator" }, { status: 500 })
  }
}
