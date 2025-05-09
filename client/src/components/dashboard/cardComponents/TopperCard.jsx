import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopperCard({ icon, title, counts, toppersList, className }) {
  // console.log("toppersList :>> ", toppersList);
  // Dummy data
  return (
    <Card className={`rounded-3xl overflow-hidden  ${className}`} dir="rtl">
      <CardHeader
        className={`flex flex-row items-center justify-  bg-gradient-to-t from-sky-100 via-sky-50 to-blue-50 pb-2 xl:pb-6 `}>
        <CardTitle className="flex w-full justify-evenly items-center gap-1 xl:gap-2 text-base xl:text-xl text-blue-800 ">
          <span> {icon} </span>
          <span> {title} </span>
          <span> {icon} </span>
        </CardTitle>
        {/* <div className="bg-sky-100 px-3 py-1 rounded-full text-blue-700 font-semibold text-base xl:text-sm">
          {counts[0]} تعليق
        </div> */}
      </CardHeader>
      <CardContent className="py-2 xl:py-4">
        <div className="flex flex-row justify-evenly items-center gap-4 xl:gap-6">
          {/* // TODO Razouq: mapper here */}
          {toppersList.map((topper, i) => (
            <div key={i} className="flex items-center gap-4 xl:gap-6">
              <div
                className={`relative size-12 xl:size-[72px] rounded-full bg-gradient-to-t from-sky-100 via-sky-50 to-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 shrink-0`}>
                {topper.name.charAt(0)}
                <div className="absolute -bottom-[6px] -start-3 text-sm bg-sky-100 text-blue-700 border rounded-full py-[1px] px-[4px] xl:px-2 xl:py-[2px]">
                  {topper.comment_count}
                </div>
              </div>
              <div>
                <h3 className="text-sm xl:text-xl font-semibold">{topper.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
