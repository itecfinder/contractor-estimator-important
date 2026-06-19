import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { businessName, phone, email } =
      await req.json()

    if (!phone) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Phone number required",
        },
        { status: 400 }
      )
    }

    const url =
      `${process.env.BD_API_URL}/api/v2/user/get?property=phone_number&property_value=${encodeURIComponent(
        phone
      )}`

    const bdResponse = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
      },
    })
console.log("BD STATUS:", bdResponse.status)

const text = await bdResponse.text()

console.log("BD RAW RESPONSE:", text)

if (!bdResponse.ok) {
  throw new Error(`BD Error ${bdResponse.status}: ${text}`)
}

const bdUser = JSON.parse(text)

    // MEMBER FOUND
    if (bdUser?.id) {
      return NextResponse.json({
        allowed: true,
        access: "paid",
        memberId: bdUser.id,
      })
    }

    // NOT FOUND = LEAD
    console.log("NEW LEAD", {
      businessName,
      phone,
      email,
      source: "contractpro",
    })

    return NextResponse.json({
      allowed: true,
      access: "lead",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        allowed: false,
        message: "Unable to verify account",
      },
      { status: 500 }
    )
  }
}
