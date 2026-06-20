import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["1"]
const PAID_PLAN_IDS = ["2", "3"]

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

    const bdResponse = await fetch(
      `${process.env.BD_API_URL}/api/v2/user/search`,
      {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.BD_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    )

    const text = await bdResponse.text()

    if (!bdResponse.ok) {
      throw new Error(`BD Error ${bdResponse.status}: ${text}`)
    }

    const bdData = JSON.parse(text)

    const bdUser = Array.isArray(bdData?.message)
      ? bdData.message[0]
      : bdData?.message || bdData?.user || bdData

    if (bdUser?.user_id || bdUser?.id) {
      const subscriptionId = String(
        bdUser.subscription_id ||
        bdUser.subscriptionId ||
        ""
      )

      const access =
        PAID_PLAN_IDS.includes(subscriptionId)
          ? "paid"
          : "free"

      return NextResponse.json({
        allowed: true,
        access,
        memberId: bdUser.user_id || bdUser.id,
        email: bdUser.email || "",
        subscriptionId,
      })
    }

    // Not found = lead
    return NextResponse.json({
      allowed: true,
      access: "lead",
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
