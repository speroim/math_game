export interface PracticeProps {
  title: number;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  lastQuestions: LastQuestions;
  email: string;
  rank: number;
}

export interface LastQuestions {
  add: number[];
  sub: number[];
  mul: number[];
  div: number[];
}

export type answerProps = {
  title: Question[];
  id: number;
  onHandleChecked: (isCorrect: boolean) => void;
};

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  password: string;
  lastQuestions: LastQuestions;
  email: string;
  score: number;
  rank: number;
}
export interface Question {
  id: number;
  question: string;
  answer: number;
  rank: number;
  category: string;
}

export type Category = keyof LastQuestions;
