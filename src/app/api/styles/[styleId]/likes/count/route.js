import dbConnect from "@/app/utils/dbConnect";
import Like from "@/app/models/Like";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { styleId } = await params;
    const count = await Like.countDocuments({ styleId });
    return Response.json({ count });
  } catch (error) {
    return Response.json(
      { error: "Failed to get like count" },
      { status: 500 }
    );
  }
}
