import dbConnect from "@/app/utils/dbConnect";
import Style from "@/app/models/Style";
import Like from "@/app/models/Like";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { styleId } = await params;

    // Delete the style and its associated likes
    await Promise.all([
      Style.deleteOne({ _id: styleId }),
      Like.deleteMany({ styleId }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting style:", error);
    return Response.json({ error: "Failed to delete style" }, { status: 500 });
  }
}
