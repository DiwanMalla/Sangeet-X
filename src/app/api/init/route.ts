import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Check if default user already exists
    const existingUser = await prisma.user.findFirst({
      where: { username: "defaultuser" },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        data: existingUser,
        message: "Default user already exists",
      });
    }

    // Create default user
    const defaultUser = await prisma.user.create({
      data: {
        email: "user@sangeetx.com",
        username: "defaultuser",
        displayName: "Default User",
        avatar: null,
        isAdmin: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: defaultUser,
      message: "Default user created successfully",
    });
  } catch (error) {
    console.error("Error initializing default user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize default user" },
      { status: 500 }
    );
  }
}
