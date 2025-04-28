import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopperCard({ icon, title, counts, toppersList, className }) {
  // Dummy data
  return (
    <Card className={`rounded-2xl overflow-hidden ${className}`} dir="rtl">
      <CardHeader
        className={`bg-gradient-to-t from-sky-50 via-sky-50 to-blue-50 pb-6 flex flex-row items-center justify-between`}>
        <CardTitle className="flex items-center gap-2 text-blue-800 text-xl">
          {icon}
          {title}
        </CardTitle>
        <div className="bg-sky-100 px-3 py-1 rounded-full text-blue-700 font-semibold">{counts[0]} تعليق</div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-row justify-evenly items-center gap-6">
          {/* // TODO Razouq: mapper here */}
          {toppersList.map((topper, i) => (
            <div key={i} className="flex items-center gap-6">
              <div
                className={`h-14 w-14 rounded-full bg-gradient-to-t from-sky-50 via-sky-50 to-blue-50 flex items-center justify-center text-2xl font-bold text-blue-700 shrink-0`}>
                {topper.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{topper.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
