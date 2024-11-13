import dbConnect from "@/app/utils/dbConnect";
import Like from "@/app/models/Like";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { styleId, userId } = await params;
    const like = await Like.findOne({ styleId, userId });
    return Response.json({ isLiked: !!like });
  } catch (error) {
    return Response.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}
