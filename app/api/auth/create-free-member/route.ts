export async function POST(req: NextRequest) {
  try {
    const business = await req.json()

    const email = String(business?.email || "").trim().toLowerCase()
    const password = Math.floor(100000 + Math.random() * 900000).toString()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      )
    }

    const response = await fetch(BD_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.BD_API_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
        subscription_id: "8",
        first_name: business.first_name || "",
        last_name: business.last_name || "",
        phone: business.phone || "",
        address1: business.address || "",
        city: business.city || "",
        state_code: business.state_code || "",
        zip_code: business.zip_code || "",
        country_code: business.country_code || "US",
        active: "1",
        flow_source: "itecfinder_estimator",
      }),
    })

    const raw = await response.text()

    let data: any
    try {
      data = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid BD response" },
        { status: 502 }
      )
    }

    const msg = JSON.stringify(data).toLowerCase()

    const isDuplicate =
      msg.includes("duplicate") ||
      msg.includes("already") ||
      msg.includes("exists")

    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        status: "existing_user",
        email,
        password: null,
        user: null,
      })
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "BD create failed",
          error: data,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      status: "created",
      email,
      password,
      user: data,
    })
  } catch (error) {
    console.error("BD CREATE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    )
  }
}
