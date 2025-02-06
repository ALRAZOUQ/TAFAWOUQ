import { Link } from "react-router-dom";
import MainHeader from "../components/MainHeader.jsx";

export default function Home_page() {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      description: "Learn HTML, CSS, and JavaScript.",
    },
    {
      id: 2,
      title: "Data Structures",
      description: "Understand algorithms and data structures.",
    },
    {
      id: 32,
      title: "Machine Learning",
      description: "Introduction to AI and ML models.",
    },
    {
      id: 443,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 47,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 45,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 41,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 421,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 42,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 43,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 44,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 433625432,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 434625,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 4253235,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 436425,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 43452423,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 463435,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 4432,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 4543,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 4432,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
    {
      id: 4421,
      title: "Cybersecurity",
      description: "Protect systems from cyber threats.",
    },
  ];
  const course_container = `mt-10 mb-10 max-h-96 ${
    courses.length > 6 ? "overflow-y-scroll" : undefined
  } bg-gray-100 shadow-inner shadow-gray-300 rounded-lg w-3/4 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scrollbar-thumb-blue-500`;

  return (
    <div className="h-screen w-full bg-gray-300 flex justify-center items-center p-6">
      <div className={course_container}>
        {courses.map((course) => (
          <Link>
            <div
              key={course.id}
              className="bg-gradient-to-b from-TAF-200 via-gray-300 to-TAF-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {course.title}
              </h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
