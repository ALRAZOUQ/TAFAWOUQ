import Screen from "../components/Screen";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function BannedAccounts() {
  const [bannedAccounts, setBannedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBannedAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/admin/bannendAccounts");
        if (response.status === 200) {
          setBannedAccounts(response.data.bannendAccounts);
        }
      } catch (error) {
        console.error("Failed to fetch banned accounts:", error);
        toast.error("حدث خطأ أثناء جلب الحسابات المحظورة");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannedAccounts();
  }, []); // Remove bannedAccounts from dependency array
  const handleUnban = async (userId) => {
    try {
      const response = await axios.put("/admin/unBanUser", {
        studentId: userId,
      });
      if (response.status === 200) {
        setBannedAccounts((prev) =>
          prev.filter((acc) => acc.result.user.id !== userId)
        );
        toast.success("تم فك الحظر بنجاح");
      }
    } catch (error) {
      console.error("Failed to unban account:", error);
      toast.error("حدث خطأ أثناء فك الحظر");
    }
  };

  return (
    <Screen title="Banned Accounts" className="p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-right">
          الحسابات المحظورة
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-TAF-300"></div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-0">
            {/* Mobile view - Cards */}
            <div className="block sm:hidden space-y-4">
              {bannedAccounts?.map((bannedAccount) => (
                <div key={bannedAccount.result.user.email} className="bg-gray-50 shadow-md rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">اسم المستخدم</span>
                      <span className="text-sm text-gray-900">{bannedAccount.result.user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">الإيميل</span>
                      <span className="text-sm text-gray-900 break-all">{bannedAccount.result.user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 mx-2">السبب</span>
                      <span className="text-sm text-gray-900">{bannedAccount.result.ban.reason}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleUnban(bannedAccount.result.user.id)}
                      className="w-full sm:w-auto bg-red-500 hover:opacity-85 active:opacity-65 hover:shadow-md text-white font-bold py-2 px-4 rounded transition duration-200 text-sm"
                    >
                      فك الحظر
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet and Desktop view - Table */}
            <div className="hidden sm:block bg-gray-50 shadow-md hover:shadow-lg rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-TAF-300">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      اسم المستخدم
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      الإيميل
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      السبب
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      إجراء
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-200">
                  {bannedAccounts?.map((bannedAccount) => (
                    <tr key={bannedAccount.result.user.email} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-[11px] sm:text-sm md:text-base text-gray-900">
                        {bannedAccount.result.user.name}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-[11px] sm:text-sm md:text-base text-gray-900 break-all">
                        {bannedAccount.result.user.email}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-[11px] sm:text-sm md:text-base text-gray-900">
                        {bannedAccount.result.ban.reason}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-center">
                        <button
                          onClick={() => handleUnban(bannedAccount.result.user.id)}
                          className="bg-red-500 hover:opacity-85 active:opacity-65 hover:shadow-md text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded transition duration-200 text-[11px] sm:text-sm"
                        >
                          فك الحظر
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
