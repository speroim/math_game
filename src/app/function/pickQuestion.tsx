import { error } from "console";
import { Question } from "../../../public/practiceType";
import { promises } from "dns";

export interface LastAnsweredItem {
  id: number;
  answeredAt: number;
}

export interface LastQuestions {
  addQuestions: LastAnsweredItem[];
  subQuestions: LastAnsweredItem[];
  mulQuestions: LastAnsweredItem[];
  divQuestions: LastAnsweredItem[];
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  password: string;
  lastQuestions: LastQuestions;
  email: string;
  rank: number;
}

type Category = keyof LastQuestions;

export async function pickQuestion(
  questions: Question[],
  player: Player,
  category: Category
): Promise<Question | null> {
  let diffRange = 100;
  const RANGE_STEP = 10;
  const INCREASE_EVERY = 3;
  const MAX_RANGE = 1000;
  const twoDays = 48 * 60 * 60 * 1000;
  const MAX_TRIES = questions.length * 2;

  let tries = 0;
  if (questions.length === 0) {
    console.error("no question in server");
    return null;
  }

  const getRecentAnsweredIds = () =>
    (player.lastQuestions[category] ?? [])
      .filter((item) => Date.now() - item.answeredAt < twoDays)
      .map((item) => item.id);

  const saveLastQuestions = async () => {
    try {
      console.log("Sending to server:", {
        userId: player.id,
        lastQuestions: player.lastQuestions,
      });
      const response = await fetch(`/api/data/users/lastQuestion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: player.id,
          lastQuestions: player.lastQuestions,
        }),
      });

      // הוסף בדיקה זו!
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Failed to update lastQuestions on server", err);
    }
  };

  while (true) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];
    const RecentAnsweredIds = getRecentAnsweredIds();

    if (tries >= MAX_TRIES) {
      player.lastQuestions[category] = [];
      diffRange = 100;
      tries = 0;
      await saveLastQuestions();
    }

    if (RecentAnsweredIds.includes(q.id)) {
      tries++;
    } else {
      const diff = Math.abs(q.rank - player.rank);
      if (diff >= diffRange) {
        diffRange += RANGE_STEP;
      } else {
        player.lastQuestions[category].push({
          id: q.id,
          answeredAt: Date.now(),
        });
        await saveLastQuestions();
        console.log(player, "push");

        return q;
      }
    }
  }
}
