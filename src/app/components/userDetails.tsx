import usersImport from "@/../public/users.json";

type usersImport = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  score: number;
};

export default function UserDetails() {
  const users = usersImport as usersImport[];
  const user = users[0].firstName + " " + users[0].lastName;
  const score = users[0].score;

  return (
    <div>
      {user} your current score is {score}
    </div>
  );
}
