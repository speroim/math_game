"use client";

import { Title } from "@/app/components/title";
import addQuestions from "@/../public/addQuestions.json";
import divQuestions from "@/../public/divQuestions.json";
import mulQuestions from "@/../public/mulQuestions.json";
import subQuestions from "@/../public/subQuestions.json";
import Answer from "@/app/components/answer";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Player, PracticeProps } from "../../../../public/practiceType";

export default function Practice({ title }: PracticeProps) {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [userData, setUserData] = useState<Player | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserString = localStorage.getItem("user");
      if (storedUserString) {
        try {
          const userObject: Player = JSON.parse(storedUserString);
          setUserData(userObject);
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
        }
      }
    }
  }, []);

  const currentPath = usePathname();
  console.log(currentPath);
  const questionData = [
    { name: "addQuestions", data: addQuestions },
    { name: "subQuestions", data: subQuestions },
    { name: "mulQuestions", data: mulQuestions },
    { name: "divQuestions", data: divQuestions },
  ];

  const chooseQuestion = () => {
    const length = questionData[title].data.length;
    return Math.floor(Math.random() * length);
  };
  useEffect(() => {
    setSelectedQuestion(chooseQuestion());
  }, []);
  if (selectedQuestion === null) {
    return <div className="fullPage">טוען...</div>;
  }

  const updateUserScore = async (userId: number, points: number) => {
    try {
      const response = await fetch("/api/data/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: "users.json",
          id: userId,
          increment: points,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to update score. Server returned:",
          response.status
        );
        return;
      }

      const result = await response.json();
      console.log("Score user updated:", result.newScore);

      // --- 4. סנכרון localStorage ו-State ---

      // א. טעינת הנתונים הנוכחיים מהזיכרון המקומי
      const storedUserString = localStorage.getItem("user");

      if (storedUserString) {
        try {
          // ב. המרת המחרוזת לאובייקט
          const userObject = JSON.parse(storedUserString);

          // ג. עדכון הציון באובייקט המקומי
          userObject.rank = result.newScore;

          // ד. שמירת האובייקט המעודכן בחזרה ב-localStorage
          localStorage.setItem("user", JSON.stringify(userObject));

          // ה. עדכון ה-State של React כדי לרנדר את הציון החדש מיידית
          setUserData(userObject);
        } catch (error) {
          // טיפול בשגיאת JSON.parse או גישה ל-localStorage
          console.error("Error updating local user data:", error);
        }
      }

      // 5. החזרת הציון החדש
      return result.newScore;
    } catch (error) {
      // 6. טיפול בשגיאות רשת (כשלון חיבור, DNS וכו')
      console.error("Error updating score (Network/Fetch failure):", error);
    }
  };

  const updateQuestionScore = async (
    fileName: string,
    userId: number,
    points: number
  ) => {
    console.log(fileName, "and", userId, "and", points);
    try {
      const response = await fetch("/api/data/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName + ".json",
          id: userId,
          increment: points,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update Questions");
        return;
      }
      const result = await response.json();
      console.log("Score question updated:", result.newScore);

      return result.newScore;
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const isCorrectHandle = async (isCorrect: boolean) => {
    if (userData !== null) {
      if (isCorrect) {
        await updateQuestionScore(
          questionData[title].name,
          selectedQuestion,
          -5
        );
        await updateUserScore(userData.id, 5);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        await updateQuestionScore(
          questionData[title].name,
          selectedQuestion,
          5
        );
        await updateUserScore(userData.id, -5);
      }
    }
  };

  return (
    <div className="fullPage">
      <div className="main">
        <div className="topic">
          <Title titleProp={title} />
        </div>
        <div className="question w-full flex bg-gray-100 border-4 p-4 place-content-center text-5xl font-bold ">
          {" "}
          {questionData[title].data[selectedQuestion].question}
        </div>
        <div className="w-full my-2">
          {" "}
          <Answer
            title={questionData[title].data}
            id={selectedQuestion}
            onHandleChecked={isCorrectHandle}
          />
        </div>
        {userData?.nickName} your current score is {userData?.rank}
      </div>
    </div>
  );
}
