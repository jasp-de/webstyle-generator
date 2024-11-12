import dbConnect from "../../utils/dbConnect.js";
import Style from "../../models/Style.js";

export async function GET() {
  try {
    await dbConnect();
    const styles = await Style.find({});
    if (!styles || styles.length === 0) {
      return Response.json({ error: "No styles found" }, { status: 404 });
    }

    return Response.json(styles);
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch styles from database" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const style = await request.json();
    const newStyle = await Style.create(style);
    return Response.json(newStyle);
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to save style to database" },
      { status: 500 }
    );
  }
}
