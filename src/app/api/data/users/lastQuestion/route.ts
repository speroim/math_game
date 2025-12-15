// app/api/data/users/lastQuestion/route.ts
// שים לב! זה App Router, לא Pages Router

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface QuestionEntry {
  id: string;
  answeredAt: number;
}

interface LastQuestions {
  [category: string]: QuestionEntry[];
}

interface User {
  id: string;
  rank: number;
  lastQuestions: LastQuestions;
  // שדות נוספים של המשתמש...
}

interface UpdateRequest {
  userId: string;
  lastQuestions: LastQuestions;
}

const USERS_FILE_PATH = path.join(process.cwd(), "public", "users.json");

export async function PATCH(request: NextRequest) {
  console.log("=== PATCH API CALLED ===");

  try {
    const body: UpdateRequest = await request.json();
    console.log("Request body received:", body);
    console.log("userId:", body.userId);
    console.log("userId type:", typeof body.userId);
    console.log("lastQuestions:", body.lastQuestions);

    const { userId, lastQuestions } = body;

    if (userId === undefined || userId === null) {
      console.error("userId is missing!");
      return NextResponse.json(
        { error: "userId is required", receivedBody: body },
        { status: 400 }
      );
    }

    // קריאת קובץ המשתמשים
    const fileContent = await fs.readFile(USERS_FILE_PATH, "utf-8");
    const users: User[] = JSON.parse(fileContent);

    // מציאת המשתמש הרלוונטי
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // מיזוג lastQuestions - שמירת הקיים והוספת החדש
    const currentUser = users[userIndex];

    // אם אין lastQuestions קיים, אתחל אותו
    if (!currentUser.lastQuestions) {
      currentUser.lastQuestions = lastQuestions;
    } else {
      // מיזוג כל קטגוריה בנפרד
      for (const category in lastQuestions) {
        if (lastQuestions.hasOwnProperty(category)) {
          if (!currentUser.lastQuestions[category]) {
            // אם הקטגוריה לא קיימת, צור אותה
            currentUser.lastQuestions[category] = lastQuestions[category];
          } else {
            // אם הקטגוריה קיימת, הוסף את הפריטים החדשים
            const existingIds = currentUser.lastQuestions[category].map(
              (item) => item.id
            );
            const newItems = lastQuestions[category].filter(
              (item) => !existingIds.includes(item.id)
            );
            currentUser.lastQuestions[category].push(...newItems);
          }
        }
      }
    }

    users[userIndex] = currentUser;

    // שמירה חזרה לקובץ
    await fs.writeFile(
      USERS_FILE_PATH,
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    console.log("Successfully updated user:", userId);

    return NextResponse.json({
      success: true,
      user: users[userIndex],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error: "Failed to update user data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
