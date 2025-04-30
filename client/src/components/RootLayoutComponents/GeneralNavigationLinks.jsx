import NavigationLink from "./NavigationLink";
import { useAuth } from "../../context/authContext";
export default function GeneralNavigationLinks() {
  const { isAuthorized, user } = useAuth();
  return (
    <>
      <NavigationLink
        linkTo={"الصفحة الرئيسية"}
        route={
          isAuthorized ? (user?.isAdmin ? "/admin/admin-home" : "/home") : "/"
        }
      />

      <NavigationLink linkTo={"المواد"} route={"/courses"} />
    </>
  );
}
