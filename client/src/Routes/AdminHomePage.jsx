import Screen from "../components/Screen";
import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard/Dashboard.jsx";
export default function AdminHomePage() {
  return (
    <Screen title="Admin Home Page" className="p-2 sm:p-4 md:p-6">
      <Dashboard />
    </Screen>
  );
}
