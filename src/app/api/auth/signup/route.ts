// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Player } from "../../../../../public/practiceType";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, nickName, lastQuestions, email, password } =
      await request.json();

    // בדיקות קלט בסיסיות
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "יש למלא את כל השדות" },
        { status: 400 }
      );
    }

    // בדיקת תקינות אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "כתובת אימייל לא תקינה" },
        { status: 400 }
      );
    }

    // בדיקת אורך סיסמה
    if (password.length < 4) {
      return NextResponse.json(
        { message: "הסיסמה חייבת להיות לפחות 4 תווים" },
        { status: 400 }
      );
    }

    // קריאת קובץ ה-JSON
    const filePath = path.join(process.cwd(), "public", "users.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const users: Player[] = JSON.parse(fileContents);

    // בדיקה האם האימייל כבר קיים
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { message: "האימייל הזה כבר תפוס" },
        { status: 409 }
      );
    }

    // יצירת ID חדש (הגדול ביותר + 1)
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    // יצירת משתמש חדש
    const newUser: Player = {
      id: newId,
      firstName,
      lastName,
      nickName,
      lastQuestions,
      password, // בפרודקשן צריך להצפין את הסיסמה!
      email,
      rank: 100, // התחלה עם 100 נקודות
    };

    // הוספת המשתמש למערך
    users.push(newUser);

    // שמירה חזרה לקובץ JSON
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");

    // החזרת תשובה מוצלחת (ללא הסיסמה!)
    return NextResponse.json(
      {
        message: "החשבון נוצר בהצלחה",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          nickName: newUser.nickName,
          lastQuestions: newUser.lastQuestions,
          email: newUser.email,
          rank: newUser.rank,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
