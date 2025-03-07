import MainHeader from "../components/RootLayoutComponents/MainHeader";
import MainFooter from "../components/RootLayoutComponents/MainFooter";
import { Outlet } from "react-router-dom";
export default function RootLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
      <MainFooter />
    </>
  );
}
