import Screen from "../components/Screen";
import { useState, useEffect } from "react";

export default function BannedAccounts() {
  const [bannedUsers, setBannedUsers] = useState([]);

  useEffect(() => {
    setBannedUsers([
      {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        bannedDate: "2024-01-01",
      },
      {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        bannedDate: "2024-01-02",
      },
    ]);
  }, []);

  const handleUnban = async (userId) => {
    try {
      console.log(`Unbanning user ${userId}`);
      setBannedUsers(bannedUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error unbanning user:", error);
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
                  إجراء
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {bannedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleUnban(user.id)}
                      className="bg-TAF-100 hover:opacity-85 active:opacity-65 hover:shadow-md text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Unban
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
