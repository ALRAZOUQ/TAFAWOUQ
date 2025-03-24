import Screen from "../components/Screen";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function BannedAccounts() {
  const [bannedAccounts, setBannedAccounts] = useState([]);

  useEffect(() => {
    const fetchBannedAccounts = async () => {
      try {
        const response = await axios.get("/admin/bannendAccounts");
        if (response.status === 200) {
          setBannedAccounts(response.data.bannendAccounts);
        }
      } catch (error) {
        console.error("Failed to fetch banned accounts:", error);
      }
    };

    fetchBannedAccounts();
  }, [bannedAccounts]);
  const handleUnban = async (userId) => {
    try {
      const response = await axios.put("/admin/unBanUser", { studentId:userId });
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
    <Screen title="Banned Accounts" className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          الحسابات المحظورة
        </h1>
        <div className="bg-gray-50 shadow-md hover:shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-TAF-300">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المستخدم
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإيميل
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السبب
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراء
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {bannedAccounts?.map((bannedAccount) => (
                <tr key={bannedAccount.result.user.email}>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {bannedAccount.result.user.name}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {bannedAccount.result.user.email}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {bannedAccount.result.ban.reason}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleUnban(bannedAccount.result.user.id)}
                      className="bg-red-500 hover:opacity-85 active:opacity-65 hover:shadow-md text-white font-bold py-2 px-4 rounded transition duration-200"
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
    </Screen>
  );
}
