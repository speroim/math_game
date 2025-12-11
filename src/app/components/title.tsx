import titles from "@/../public/titles.json";

export function Title({ titleProp }: { titleProp: number }) {
  const add = titles[0].title;
  const sub = titles[1].title;
  const mul = titles[2].title;
  const div = titles[3].title;
  return (
    <div className="place-content-center flex text-4xl w-full m-4">
      you playing {titles[titleProp].title}
    </div>
  );
}
