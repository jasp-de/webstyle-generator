import dbConnect from "../../../../utils/dbConnect";
import Like from "../../../../models/Like";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    const likes = await Like.find({ userId }).populate("styleId");
    const likedStyles = likes.map((like) => like.styleId).filter(Boolean);

    return Response.json(likedStyles);
  } catch (error) {
    console.error("Error fetching liked styles:", error);
    return Response.json(
      { error: "Failed to fetch liked styles" },
      { status: 500 }
    );
  }
}
