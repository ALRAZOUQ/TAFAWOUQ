import NavigationLink from "./NavigationLink";
import { useAuth } from "../../context/authContext";
export default function GeneralNavigationLinks() {
  const { isAuthorized, user } = useAuth();
  return (
    <>
      <NavigationLink
        linkTo={user?.isAdmin ? "إحصائيات المنصة" :"الصفحة الرئيسية"}
        route={isAuthorized ? (user?.isAdmin ? "/admin" : "/home") : "/"}
      />

      <NavigationLink linkTo={"المواد"} route={"/courses"} />
    </>
  );
}
