import dbConnect from "../../utils/dbConnect.js";
import Style from "../../models/Style.js";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const likedBy = searchParams.get("likedBy");
    const createdBy = searchParams.get("createdBy");

    let query = {};
    if (likedBy) {
      query.likedBy = likedBy;
    }
    if (createdBy) {
      query.createdBy = createdBy;
    }

    const styles = await Style.find(query);
    if (!styles || styles.length === 0) {
      return Response.json([]);
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
