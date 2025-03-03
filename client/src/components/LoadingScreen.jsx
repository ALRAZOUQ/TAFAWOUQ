export default function LoadingScreen() {
  let circleCommonClasses = "h-12 w-12 bg-TAF-100 rounded-full mx-6";

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200">
      <div className="flex space-x-4">
        <div className={`${circleCommonClasses} animate-bounce`}></div>
        <div className={`${circleCommonClasses} animate-bounce200`}></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
    </div>
  );
}
