import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import { models, model, Schema } from "mongoose";

// Get the User model from the existing models file
import UserModel from "@/app/models/User";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;

    // Find user by email instead of ID
    const user = await UserModel.findOne({ email: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.email, // Use email as the ID
      name: user.name,
      image: user.image,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
