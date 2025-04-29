import axios from "../../../api/axios";
import React from "react";
import { HashLink } from "react-router-hash-link";

function NotificatoinElement({
  id,
  coursecode,
  courseid,
  parentcommentid,
  replyauthor,
  readed,
  time_ago,
  setNotificationsList,
}) {
  return (
    <HashLink
      onClick={async (e) => {
        if (!readed) {
          try {
            let readANotification = await axios.put("protected/readANotification", { id });
            console.log(readANotification.data);
          } catch (error) {
            console.error(error);
          }
        }
        setNotificationsList((prev) =>
          prev.map((aNotificationData) =>
            aNotificationData.id === id ? { ...aNotificationData, readed: true } : aNotificationData
          )
        );
      }}
      to={`/courses/${courseid}#${parentcommentid}`}
      smooth
      className="flex w-full !cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">{replyauthor.charAt(0)}</span>
        </div>
      </div>
      <div id="toFillTheAvailableSpace" className="w-full ps-3">
        <div className="block text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{replyauthor}</span> رد عليك بخصوص
          <span className="font-semibold text-gray-900 dark:text-white"> {coursecode}</span>
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500">{time_ago}</div>
      </div>
    </HashLink>
  );
}

export default NotificatoinElement;
