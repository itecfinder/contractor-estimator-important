import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: { email },
    })

    response.cookies.set({
      name: "session",
      value: JSON.stringify({
        email,
        loggedIn: true,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
