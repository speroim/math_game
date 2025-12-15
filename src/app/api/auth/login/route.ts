// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Player } from "../../../../../public/practiceType";

// הגדרת הטייפ של המשתמש

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // בדיקות קלט בסיסיות
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // קריאת קובץ ה-JSON
    // שנה את הנתיב לפי המיקום של קובץ המשתמשים שלך
    const filePath = path.join(process.cwd(), "public", "users.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const users: Player[] = JSON.parse(fileContents);

    // חיפוש המשתמש לפי אימייל
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { message: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    // בדיקת סיסמה
    if (user.password !== password) {
      return NextResponse.json(
        { message: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    // התחברות מוצלחת - החזרת פרטי המשתמש (ללא הסיסמה!)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        lastQuestions: user.lastQuestions,
        email: user.email,
        rank: user.rank,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
