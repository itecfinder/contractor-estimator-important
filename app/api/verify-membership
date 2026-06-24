 import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["8"]
const PAID_PLAN_IDS = ["4", "112"]

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Email required",
        },
        { status: 400 }
      )
    }

    console.log("VERIFY MEMBER:", email)

    const url =
      `${process.env.BD_API_URL}/api/v2/user/get` +
      `?property=email` +
      `&property_value=${encodeURIComponent(email)}`

    console.log("BD URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
      },
      cache: "no-store",
    })

    const raw = await response.text()

    console.log("BD STATUS:", response.status)
    console.log("BD RAW RESPONSE:", raw)

    if (!response.ok) {
      throw new Error(
        `BD API Error ${response.status}: ${raw}`
      )
    }

    let data: any = null

    try {
      data = raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error("JSON PARSE ERROR:", e)
      throw new Error("Invalid BD response")
    }

    console.log(
      "BD PARSED RESPONSE:",
      JSON.stringify(data, null, 2)
    )

    const user =
      data?.user ||
      data?.data?.[0] ||
      data?.result?.[0] ||
      data?.data ||
      data?.result ||
      data

    console.log(
      "BD USER:",
      JSON.stringify(user, null, 2)
    )
// No user found in BD
const isEmptyUser =
  !user ||
  (Array.isArray(user) && user.length === 0)

if (isEmptyUser) {
  return NextResponse.json({
    allowed: true,
    access: "lead",
  })
} 
const planId = String(
  user.subscription_id ||
  user.membership_plan_id ||
  user.plan_id ||
  ""
)
    console.log("PLAN ID:", planId)

    if (PAID_PLAN_IDS.includes(planId)) {
      return NextResponse.json({
        allowed: true,
        access: "paid",
        planId,
      })
    }

    if (FREE_PLAN_IDS.includes(planId)) {
      return NextResponse.json({
        allowed: true,
        access: "free",
        planId,
      })
    }

    console.log("UNKNOWN PLAN:", planId)

    return NextResponse.json({
      allowed: true,
      access: "lead",
      planId,
    })
  } catch (error) {
    console.error("VERIFY ERROR:", error)

    return NextResponse.json(
      {
        allowed: false,
        message: "Unable to verify account",
      },
      { status: 500 }
    )
  }
}
