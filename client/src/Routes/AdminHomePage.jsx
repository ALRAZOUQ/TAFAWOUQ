import { reports } from "../dummy-data/dummyData";
import ReportCard from "../components/ReportCard";
export default function AdminHomePage() {
  return (
    <div className="min-h-screen max-h-max w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200">
      <div className="grid grid-cols-4 gap-2">
        {reports.map((report) => {
          return (
            <ReportCard
              comment={report.comment}
              commentWriter={report.commentWriter}
              key={report.id}
              onBanUser={() => {}}
              onDeleteComment={() => {}}
              onReject={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}
