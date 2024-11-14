import dbConnect from "@/app/utils/dbConnect";
import Style from "@/app/models/Style";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { styleId } = await params;
    await Style.deleteOne({ _id: styleId });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting style:", error);
    return Response.json({ error: "Failed to delete style" }, { status: 500 });
  }
}
