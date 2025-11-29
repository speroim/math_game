import addQuestions from "@/../public/addQuestions.json";

type Question = {
  id: number;
  question: string;
  answer: number;
  score: number;
};

type questionProps = {
  title?: number;
  id?: number;
};

export function Question({ title, id }: questionProps) {
  //   const Questions = addQuestions as Question[];
  let subject;
  if (title === 1 && id !== undefined) {
    return addQuestions[id].question;
  }
  const currentQuestion = subject;
  return currentQuestion;
}
