import { Question } from "../../../public/practiceType";

export interface LastAnsweredItem {
  id: number;
  answeredAt: number;
}

export interface LastQuestions {
  add: LastAnsweredItem[];
  sub: LastAnsweredItem[];
  mul: LastAnsweredItem[];
  div: LastAnsweredItem[];
}

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

type Category = keyof LastQuestions;

export function pickQuestion(
  questions: Question[],
  player: Player,
  category: Category
): Question | null {
  let diffRange = 10;
  const RANGE_STEP = 10;
  const INCREASE_EVERY = 3;
  const MAX_RANGE = 1000;
  const twoDays = 48 * 60 * 60 * 1000;

  let tries = 0;

  // רשימת שאלות שנענו ב־48 שעות האחרונות לקטגוריה הזו
  const recentAnsweredIds = (player.lastQuestions[category] ?? [])
    .filter((item) => Date.now() - item.answeredAt < twoDays)
    .map((item) => item.id);

  while (true) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];

    if (q.category !== category) {
      tries++;
    } else {
      // דלג על שאלות שנענו ביומיים האחרונים
      if (recentAnsweredIds.includes(q.id)) {
        tries++;
      } else {
        // בדיקת התאמה לטווח קושי
        if (Math.abs(q.rank - player.rank) <= diffRange) {
          // עדכון היסטוריה
          player.lastQuestions[category] ??= [];

          player.lastQuestions[category].push({
            id: q.id,
            answeredAt: Date.now(),
          });

          return q;
        }

        tries++;
      }
    }

    // הגדלת טווח כל 3 ניסיונות
    if (tries % INCREASE_EVERY === 0) {
      diffRange += RANGE_STEP;
    }

    // fallback למקרה קיצון
    if (diffRange > MAX_RANGE) {
      const filtered = questions.filter(
        (x) => x.category === category && !recentAnsweredIds.includes(x.id)
      );

      if (filtered.length === 0) {
        return null;
      }

      const best = filtered.reduce((best, cur) =>
        Math.abs(cur.rank - player.rank) < Math.abs(best.rank - player.rank)
          ? cur
          : best
      );

      player.lastQuestions[category] ??= [];

      player.lastQuestions[category].push({
        id: best.id,
        answeredAt: Date.now(),
      });

      return best;
    }
  }
}
