import dbConnect from "../../utils/dbConnect";
import Style from "../../models/Style";

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, styleId } = await request.json();

    const style = await Style.findById(styleId);
    if (!style) {
      return Response.json({ error: "Style not found" }, { status: 404 });
    }

    const isLiked = style.likedBy.includes(userId);
    if (isLiked) {
      style.likedBy = style.likedBy.filter((id) => id !== userId);
    } else {
      style.likedBy.push(userId);
    }
    await style.save();

    return Response.json({
      liked: !isLiked,
      likeCount: style.likedBy.length,
    });
  } catch (error) {
    console.error("Like error:", error);
    return Response.json({ error: "Failed to process like" }, { status: 500 });
  }
}
