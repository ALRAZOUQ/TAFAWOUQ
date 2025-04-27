import React from "react";
import BarChartOfCourseCommentsPerDay from "../cardComponents/BarChartOfCourseCommentsPerDay";

export default function CourseCommentsPerDay({ className }) {
  return (
    <div className={"w-3/4 overflow-hidden"}>
      <BarChartOfCourseCommentsPerDay {...{ className }} />
    </div>
  );
}
