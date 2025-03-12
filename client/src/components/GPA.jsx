import { useState, useEffect } from "react";
import axios from "../api/axios";
export default function GPA({ heading, value=0 }) {
  // HASSAN:color i changable you can change if you don't like it

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-gray-200 w-fit">
      <h2 className="text-lg font-semibold text-gray-600">{heading}</h2>
      <p className={`text-3xl font-bold text-TAF-100`}>{value.toFixed(2)}</p>
    </div>
  );
}
