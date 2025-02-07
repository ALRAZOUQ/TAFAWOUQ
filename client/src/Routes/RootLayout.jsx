import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import { Outlet } from "react-router-dom";
export default function RootLayout(){
    return(
        <>
        <MainHeader/>
        <Outlet/>
        <MainFooter/>
        </>
    );
}