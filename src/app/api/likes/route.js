import dbConnect from "../../utils/dbConnect";
import Like from "../../models/Like";

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, styleId } = await request.json();

    // Check if like already exists
    const existingLike = await Like.findOne({ userId, styleId });

    if (existingLike) {
      // Unlike if already liked
      await Like.deleteOne({ _id: existingLike._id });
      return Response.json({ liked: false });
    } else {
      // Create new like
      await Like.create({ userId, styleId });
      return Response.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return Response.json({ error: "Failed to process like" }, { status: 500 });
  }
}
