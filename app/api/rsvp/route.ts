import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      attendance,
      guests,
      dietary,
      message,
    } = body;

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Google Apps Script URL
    const endpoint = process.env.GOOGLE_SCRIPT_URL;

    if (!endpoint) {
      console.log("RSVP", body);

      return NextResponse.json({
        success: true,
      });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        attendance,
        guests,
        dietary,
        message,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save RSVP.");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
