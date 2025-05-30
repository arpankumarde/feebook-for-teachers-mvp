import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        error: "All fields are required",
        message: "All fields are required",
      },
      { status: 400 }
    );
  }

  try {
    // Check if provider exists
    const existingProvider = await db.provider.findUnique({
      where: { email },
    });

    if (!existingProvider) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider not found",
          message: "Provider not found",
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingProvider.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
          message: "Invalid password",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, user: existingProvider, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
