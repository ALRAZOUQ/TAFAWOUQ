import { useEffect, useState } from "react";
import TopperCard from "../cardComponents/TopperCard";
import { Activity, Trophy } from "lucide-react";
import axios from "@/api/axios";

export default function Top20Courses({ className }) {
  const [top20Courses, setTop20Courses] = useState([]);
  useEffect(() => {
    getTop20Courses(setTop20Courses);
  }, []);
  return (
    <TopperCard
      className={className}
      icon={<Activity strokeWidth={1.5} className="size-4 " />}
      title={"المقررات الأكثر تفاعلا"}
      counts={[top20Courses[0]?.comment_count]}
      toppersList={top20Courses.slice(0, 2)}
    />
  );

  async function getTop20Courses(setTop20Commenters) {
    try {
      let { data } = await axios.get("admin/dashboard/getTop20Courses");
      setTop20Commenters(data.top20Courses);
    } catch (error) {
      console.error(error);
    }
  }
}
