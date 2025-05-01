import MainHeader from "../components/RootLayoutComponents/MainHeader";
import MainFooter from "../components/RootLayoutComponents/MainFooter";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
export default function RootLayout() {
  return (
    <div className="overflow-x-hidden w-full">
      <MainHeader />
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
      <MainFooter />
    </div>
  );
}
