import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    )
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API key is not configured")
    return NextResponse.json(
      { error: "Google Maps API key is not configured" },
      { status: 500 }
    )
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&types=(cities)&key=${process.env.GOOGLE_MAPS_API_KEY}`

    console.log("Fetching from Google Places API:", apiUrl)
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status, data.error_message)
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch locations" },
        { status: 500 }
      )
    }

    const locations = data.predictions.map((prediction: any) => {
      const mainText = prediction.structured_formatting?.main_text || ""
      const secondaryText = prediction.structured_formatting?.secondary_text || ""
      const [state, country] = secondaryText.split(", ").slice(-2)

      return {
        id: prediction.place_id,
        name: mainText,
        state: state || "",
        country: country || "",
      }
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 