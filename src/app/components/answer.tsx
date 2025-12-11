"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Question } from "../function/pickQuestion";
import { answerProps } from "../../../public/practiceType";

export default function Answer({ title, id, onHandleChecked }: answerProps) {
  const [answerValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const userAnswer = Number(answerValue.trim());
    const correctAnswer = Number(title[id].answer);
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) {
      console.log("correct");
    } else {
      console.log("wrong answer 👎");
    }
    onHandleChecked(isCorrect);

    setInputValue("");
  };

  return (
    <div className="flex gap-2 place-content-center">
      <div className="answer">
        <Input
          type="text"
          value={answerValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="your answer"
        />
      </div>
      <div>
        <Button onClick={handleSubmit}>ok</Button>
      </div>
    </div>
  );
}
