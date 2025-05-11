import TwoMonthsComparison from "./cardComponents/TwoMonthsComparison";
import CourseCommentsPerDay from "./dashbaordCards/CourseCommentsPerDay";
import Top20Courses from "./dashbaordCards/Top20Courses";
import Top20Commenters from "./dashbaordCards/Top20Commenters";

export default function Dashboard() {
  const className = "border-none bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200";
  return (
    <div>
      <TwoMonthsComparison {...{ className }} />
      {/* Razouq: here We controll the top layout   */}
      <div className="flex my-5 ">
        <div id="topers" className="w-1/4 flex pe-4 flex-col justify-between ">
          <Top20Courses {...{ className }} />
          <Top20Commenters {...{ className }} />
        </div>
        <CourseCommentsPerDay className={` ${className}`} />
      </div>
    </div>
  );
}
