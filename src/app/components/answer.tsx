"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Question = {
  id: number;
  question: string;
  answer: number;
  score: number;
};
type answerProps = {
  title: Question[];
  id: number;
};

export default function Answer({ title, id }: answerProps) {
  const [answerValue, setInputValue] = useState("");
  const handleSubmit = () => {
    const userAnswer = Number(answerValue.trim());
    const correctAnswer = title[id].answer;
    if (userAnswer === correctAnswer) {
      alert("correct answer!");
    } else {
      alert("wrong answer");
    }

    setInputValue("");
  };
  return (
    <div className="flex gap-2 place-content-center">
      <div className="answer">
        <Input
          type="text"
          value={answerValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="your answer"
        />
      </div>
      <div>
        <Button onClick={handleSubmit}>ok</Button>
      </div>
    </div>
  );
}
