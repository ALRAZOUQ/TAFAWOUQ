import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import CreateTermModal from "./CreateTermModal";

export default function AdminLinks() {
  const navigate = useNavigate();
  const route = useLocation();
  return (
    <>
      <NavigationLink linkTo={"البلاغات"} route={"/admin/reports"} />
      <NavigationLink
        linkTo={"الحسابات المحظورة"}
        route={"/admin/bannedaccounts"}
      />
      <NavigationLink linkTo={"العناصر المخفية"} route={"/admin/hiddenItems"} />

      <CreateTermModal>
        <motion.button
          onClick={() => {
            navigate("/admin/createTerm");
          }}
          whileHover={{
            scale: 1.04,
          }}
          transition={{ duration: 0.2 }}
          className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 text-gray-700 hover:text-gray-500 transition-colors border-b-4 border-TAF-100 ${
            route.pathname === "/admin/createTerm"
              ? "border-opacity-100"
              : "border-opacity-0"
          }`}
        >
          إنشاء ترم
        </motion.button>
      </CreateTermModal>
    </>
  );
}
