import dbConnect from "../../utils/dbConnect";
import Like from "../../models/Like";
import Style from "../../models/Style";

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, styleId } = await request.json();

    if (!userId || !styleId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if style exists first
    const style = await Style.findById(styleId);
    if (!style) {
      return Response.json({ error: "Style not found" }, { status: 404 });
    }

    // Check if like already exists
    const existingLike = await Like.findOne({ userId, styleId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return Response.json({ liked: false });
    } else {
      await Like.create({ userId, styleId });
      return Response.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    if (error.code === 11000) {
      // Duplicate key error
      return Response.json({ error: "Already liked" }, { status: 409 });
    }
    return Response.json({ error: "Failed to process like" }, { status: 500 });
  }
}
