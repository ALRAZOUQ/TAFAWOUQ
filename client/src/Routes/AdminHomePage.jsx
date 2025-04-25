import Screen from "../components/Screen";
import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard/Dashboard.jsx";
export default function AdminHomePage() {
  return (
    <Screen title="Admin Home Page" className="p-2 sm:p-4 md:p-6">
      <div className="w-full  mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-right">
          هنا راح نعرض مؤشرات الموقع
        </h1>
      </div>
      <Dashboard />
    </Screen>
  );
}
