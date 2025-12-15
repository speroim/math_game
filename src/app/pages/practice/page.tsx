"use client";

import { Title } from "@/app/components/title";
import addQuestions from "@/../public/addQuestions.json";
import divQuestions from "@/../public/divQuestions.json";
import mulQuestions from "@/../public/mulQuestions.json";
import subQuestions from "@/../public/subQuestions.json";
import Answer from "@/app/components/answer";
import { useEffect, useState } from "react";
import { PracticeProps, Question } from "../../../../public/practiceType";
import { pickQuestion, Player } from "@/app/function/pickQuestion";

export default function Practice({ title }: PracticeProps) {
  const defaultUser: Player = {
    id: 0,
    firstName: "",
    lastName: "",
    nickName: "",
    password: "",
    lastQuestions: {
      addQuestions: [],
      subQuestions: [],
      mulQuestions: [],
      divQuestions: [],
    },
    email: "",
    rank: 0,
  };

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [userData, setUserData] = useState<Player | null>(defaultUser);

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      try {
        const userObject: Player = JSON.parse(storedUserString);
        setUserData(userObject);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log("userData updated:", userData);
  }, [userData]);

  const questionData = [
    { name: "addQuestions", data: addQuestions },
    { name: "subQuestions", data: subQuestions },
    { name: "mulQuestions", data: mulQuestions },
    { name: "divQuestions", data: divQuestions },
  ] as const;

  useEffect(() => {
    if (!userData) {
      console.log("no user data");
      return;
    }
    const fetchQuestion = async () => {
      const q = await pickQuestion(
        questionData[title].data,
        userData,
        questionData[title].name
      );
      console.log(q);
      setSelectedQuestion(q);
    };
    fetchQuestion();
  }, [userData]);
  if (selectedQuestion === null) {
    console.log(selectedQuestion);

    return <div className="fullPage">טוען...</div>;
  }

  const updateUserRank = async (userId: number, points: number) => {
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
          "Failed to update rank. Server returned:",
          response.status
        );
        return;
      }

      const result = await response.json();
      console.log("rank user updated:", result.newRank);

      // --- 4. סנכרון localStorage ו-State ---

      // א. טעינת הנתונים הנוכחיים מהזיכרון המקומי
      const storedUserString = localStorage.getItem("user");

      if (storedUserString) {
        try {
          // ב. המרת המחרוזת לאובייקט
          const userObject = JSON.parse(storedUserString);

          // ג. עדכון הציון באובייקט המקומי
          userObject.rank = result.newRank;

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
      return result.newRank;
    } catch (error) {
      // 6. טיפול בשגיאות רשת (כשלון חיבור, DNS וכו')
      console.error("Error updating rank (Network/Fetch failure):", error);
    }
  };

  const updateQuestionRank = async (
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
      console.log("rank question updated:", result.newRank);

      return result.newRank;
    } catch (error) {
      console.error("Error updating rank:", error);
    }
  };

  const isCorrectHandle = async (isCorrect: boolean) => {
    if (userData !== null) {
      if (isCorrect) {
        await updateQuestionRank(
          questionData[title].name,
          selectedQuestion.id,
          -5
        );
        await updateUserRank(userData.id, 5);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        await updateQuestionRank(
          questionData[title].name,
          selectedQuestion.id,
          5
        );
        await updateUserRank(userData.id, -5);
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
          {selectedQuestion.question}
        </div>
        <div className="w-full my-2">
          {" "}
          <Answer
            title={questionData[title].data}
            id={selectedQuestion.id}
            onHandleChecked={isCorrectHandle}
          />
        </div>
        {userData?.nickName} your current rank is {userData?.rank}
      </div>
    </div>
  );
}
