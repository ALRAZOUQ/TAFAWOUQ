import { MessagesSquare } from "lucide-react";
import TopperCard from "../cardComponents/TopperCard";
import axios from "@/api/axios";
import { useEffect, useState } from "react";

export default function Top20Commenters({ className }) {
  const [top20Commenters, setTop20Commenters] = useState([]);
  useEffect(() => {
    getTop20Commenters(setTop20Commenters);
  }, []);

  return (
    <TopperCard
      className={className}
      icon={<MessagesSquare className="size-10 " strokeWidth={1.5} />}
      title={" المستخدمون الأكثر تعليقا"}
      // ? Razouq: counts will be removed if we decided to show the first 1 count only
      counts={[top20Commenters[0]?.comment_count]}
      // ? Razouq: slicing also
      toppersList={top20Commenters.slice(0, 2)}
    />
  );
  async function getTop20Commenters(setTop20Commenters) {
    try {
      let { data } = await axios.get("admin/dashboard/getTop20Commenters");
      setTop20Commenters(data.top20Commenters);
    } catch (error) {
      console.error(error);
    }
  }
}
