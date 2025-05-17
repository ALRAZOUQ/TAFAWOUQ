import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin,User } from "lucide-react";

const teamMembers = [
  {
    name: "فيصل العمران",
    role: "Software Engineer | Full-Stack Developer",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQFKnhAn7W8Obg/profile-displayphoto-shrink_400_400/B4EZPzl6vPHgAg-/0/1734958624660?e=1752710400&v=beta&t=vUy4rfCX0yd7cNubZ2a5cN15q4hI3nj3SytULuQwbIU",
    linkedin: "https://www.linkedin.com/in/faisal-alomran-6945702a2/",
    gitHub:"https://github.com/Faisal4z"

  },
  {
    name: "عامر العنزي",
    role: "Software Engineer",
    image: null,
    linkedin: "https://www.linkedin.com/in/ameralanazi/",
  },
  {
    name: "عبدالرحمن الرزوق",
    role: "Project Manager | CAPM | Full-Stack Developer | AI",
    image:"https://media.licdn.com/dms/image/v2/D4D03AQEp_pMMYGfQkw/profile-displayphoto-shrink_400_400/B4DZPtnDuWHMAg-/0/1734858260329?e=1752710400&v=beta&t=lLnucY_70bG2U-V3S9S0qnn0mzSZqqgEqPlpx59_rgc",
    linkedin: "https://www.linkedin.com/in/abdulrahman-alrazouq-154862294/",
    gitHub:"https://github.com/ALRAZOUQ"

  },
  {
    name: "عبدالرحمن الصالحي",
    role: "Software Engineer",
    image: null,
    linkedin: "https://www.linkedin.com/in/abdulrhman-alsalhi-05a863237/",
  },
  {
    name: "حسان الميمن",
    role: "Software Engineer | Front-End Developer",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQEb3ZE-Z44nQQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1712725876751?e=1752710400&v=beta&t=v3PR25UyetYAvv5xR8KQd_QkfKZTWhsBz5-Y6r5HpRo",
    linkedin: "https://www.linkedin.com/in/hassan-almaymn-b60a25294/",
    gitHub:"https://github.com/Hassanalmaymn"
  },
];

export default function TeamSection() {
  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-10">فريق تفوق</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-4 md:px-8">
        {teamMembers.map((member, index) => (
          <Card key={index} className="rounded-2xl shadow-sm bg-[#f8feff]">
            <CardContent className="flex flex-col items-center p-6">
            {member.image? (  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
               <img
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>): <User strokeWidth={1} className="size-24 mb-4 text-sky-400 font-semibold"/>}
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-gray-500 mb-3 text-center leading-relaxed">
                {member.role}
              </p>
             <div className="flex gap-4">

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                >
                <Linkedin size={20} />
              </a>
              {member.gitHub&&<a
                href={member.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-blue-800 rounded-full  "
                >
                <Github size={18} />
              </a>}
                  </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}