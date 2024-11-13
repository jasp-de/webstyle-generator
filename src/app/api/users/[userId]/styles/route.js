import dbConnect from "../../../../utils/dbConnect";
import Style from "../../../../models/Style";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const userId = await params.userId;

    const styles = await Style.find({ createdBy: userId });
    return Response.json(styles);
  } catch (error) {
    console.error("Error fetching user styles:", error);
    return Response.json(
      { error: "Failed to fetch user styles" },
      { status: 500 }
    );
  }
}
