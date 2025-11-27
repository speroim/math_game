import Header from "./components/Header";

export default function Home() {
  return (
    <div className="fullPage">
      <div className="header h=10">{<Header />}</div>
      <div className="main">
        <div className="topic">you play all exercise for grade 5</div>
        <div className="question"> 1+1 = ?</div>
        <div className="answer">input for the answer</div>
        <div className="info">name and score "hanoch 1230"</div>
      </div>
      <div className="footer">footer</div>
    </div>
  );
}
