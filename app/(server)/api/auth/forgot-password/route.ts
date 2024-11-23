import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/_lib/db";
import sendEmail from "./sendEmail";
import { signJWT, verifyJWT } from "@/app/_lib/jwt";

/**
 * Sends a password reset link with JWT token to email address provided.
 * @param request body: { email }
 * @returns NextResponse 200 on success
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_EMAIL_SERVICE_ENABLED === "false") {
      return new NextResponse(
        "Resetting Password is temporarily unavailable :/",
        {
          status: 503,
        }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("User doesn't exist", { status: 400 });
    }

    if (!user.hashedPassword || user.hashedPassword === null) {
      return new NextResponse(
        "This account was previous logged in using Google OAuth.\n Please visit login page and login with Google.",
        { status: 405 }
      );
    }

    const payload = {
      email: user.email,
    };

    const token = signJWT(payload, "5m");
    const passwordResetLink = `${process.env.BASE_URL}/forgot-password?token=${token}`;

    // send a recovery mail
    try {
      await sendEmail(user.name || "User", email, passwordResetLink);
    } catch (error) {
      console.error(error);
      return new NextResponse("Email service is currently down.", {
        status: 503,
      });
    }

    return new NextResponse("Success");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * Update user password in database. Requires are valid token with user email in payload
 * @param request body: { token, password }
 * @returns NextResponse 200 on success
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!password || !token) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    // Verify the JWT
    const decodedToken = verifyJWT(token);

    // If invalid token
    if (!decodedToken) {
      return new NextResponse(
        "Invalid/Expired link. Please generate a new link and try again.",
        { status: 401 }
      );
    }

    // If valid token
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email: decodedToken.email,
      },
      data: {
        hashedPassword,
      },
    });

    return new NextResponse("Success");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
