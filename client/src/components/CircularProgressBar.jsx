export default function CircularProgressBar({ progress }) {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="transform -rotate-90" width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          className="text-gray-300"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          className={progress < 70 ? "text-red-600" : "text-green-600"}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-lg font-bold text-gray-800">
        {progress}%
      </span>
    </div>
  );
}
