import { useState, useEffect } from "react";
import axios from "../api/axios";
export default function GPA({ heading, scheduleId }) {
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const fetchGPA = async () => {
      setLoading(true);
      try {
        const endpoint = scheduleId
          ? `/protected/viewGpa/${scheduleId}`
          : "/protected/viewGpa";

        const { data } = await axios.get(endpoint, {
          withCredentials: true, // Same as `credentials: "include"`
          headers: { "Content-Type": "application/json" },
        });

        if (isMounted) setGpa(data.averageGPA);
      } catch (err) {
        if (isMounted)
          setError(err.response?.data?.message || "Failed to fetch GPA");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGPA();

    return () => {
      isMounted = false;
    };
  }, [scheduleId]);
  if (loading) return <p>Loading GPA...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  // HASSAN:color i changable you can change if you don't like it
  function getColor(gpa) {
    if (gpa >= 4.75)
      return "bg-gradient-to-r from-green-400 via-lime-500 to-green-500 bg-clip-text text-transparent";
    if (gpa >= 4.25 && gpa <= 4.75)
      return "bg-gradient-to-r from-orange-400 via-lime-500 to-orange-500 bg-clip-text text-transparent";
    if (gpa >= 3.5) return "text-blue-500";
    if (gpa >= 2.5) return "text-yellow-500";
    return "text-red-500";
  }
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-gray-200 w-fit">
      <h2 className="text-lg font-semibold text-gray-600">{heading}</h2>
      <p className={`text-3xl font-bold ${getColor(gpa)}`}>{gpa.toFixed(2)}</p>
    </div>
  );
}
