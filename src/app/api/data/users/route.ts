import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  console.log("🔵 Route reached!");

  try {
    const { fileName, id, score, increment } = await request.json();
    console.log("📦 Received:", { fileName, id, score, increment });

    // ללא params.filename - קובע ישירות
    const fileNamePath = path.basename(fileName);
    const filePath = path.join(process.cwd(), "public", fileNamePath);
    console.log("📂 Looking for file at:", filePath);
    console.log("hi");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found at: " + filePath },
        { status: 404 }
      );
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log("📄 File data:", data);

    const item = data.find((obj: any) => obj.id === id);

    if (!item) {
      return NextResponse.json(
        { error: `id ${id} not found in file` },
        { status: 404 }
      );
    }
    // id, score, increment
    item.score = increment !== undefined ? item.score + increment : score;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("✅ Updated successfully:", item);

    return NextResponse.json({
      success: true,
      message: `Updated id ${id}`,
      newScore: item.score,
    });
  } catch (error) {
    console.error("💥 Error:", error);
    return NextResponse.json(
      { error: "Update failed: " + error },
      { status: 500 }
    );
  }
}

// // קריאה (GET)
// export async function GET(
//   request: Request,
//   { params }: { params: { filename: string } }
// ) {
//   try {
//     const safeName = validateFileName(params.filename);
//     const filePath = path.join(process.cwd(), "data", `${safeName}.json`);

//     // בדיקה אם הקובץ קיים לפני קריאה כדי לא לקרוס
//     if (!fs.existsSync(filePath)) {
//       return NextResponse.json({ error: "File not found" }, { status: 404 });
//     }

//     const fileContents = fs.readFileSync(filePath, "utf8");
//     const data = JSON.parse(fileContents);

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to load" }, { status: 500 });
//   }
// }
