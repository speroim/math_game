import Header from "./components/Header";
import { Question } from "./components/question";
import { Title } from "./components/title";
import addQuestions from "@/../public/addQuestions.json";
import UserDetails from "./components/userDetails";
import Answer from "./components/answer";

export default function Home() {
  const length = addQuestions.length;
  const random = Math.floor(Math.random() * length);
  return (
    <div className="fullPage">
      <div className="header h=10\">{<Header />}</div>
      <div className="main">
        <div className="topic">
          <Title title="hi" />
        </div>
        <div className="question w-full flex bg-gray-100 border-4 p-4 place-content-center text-5xl font-bold ">
          {" "}
          <Question title={1} id={random} />
        </div>
        <div className="w-full my-2">
          {" "}
          <Answer title={addQuestions} id={random} />
        </div>
        <UserDetails />
      </div>
    </div>
  );
}
