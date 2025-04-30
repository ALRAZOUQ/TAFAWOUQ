import NavigationLink from "./NavigationLink";

export default function UserLinks() {
  return (
    <>
      <NavigationLink linkTo={"إختباراتي القصيرة"} route={"/myquizzes"} />
      <NavigationLink linkTo={"جداولي السابقة"} route={"mypreviousschedules"} />
    </>
  );
}
