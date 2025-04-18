import React, { useEffect, useState } from "react";
import { Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { Bell } from "lucide-react";
import NotificatoinElement from "./NotificatoinElement";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

function InboxButton() {
  const [hasUnreaded, setHasUnreaded] = useState(true);
  const [notificationsList, setNotificationsList] = useState([]);
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setHasUnreaded(notificationsList.some((aNotificationData) => aNotificationData.readed == false));
  }, [notificationsList]);

  return (
    <Dropdown
      arrowIcon={false}
      className="cursor-pointer"
      label={
        <>
          {hasUnreaded && (
            <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-[3px] start-0 dark:border-gray-900"></div>
          )}
          <Bell className="w-5 h-5 fill-current text-gray-500" />
        </>
      }>
      <DropdownHeader className="cursor-default">
        <span className="block text-xl text-center">التنبيهات</span>
      </DropdownHeader>

      {notificationsList.map((aNotificationData) => (
        <React.Fragment key={aNotificationData.id}>
          <hr />
          <DropdownItem className={`${!aNotificationData.readed && "bg-blue-50"} w-full`}>
            <NotificatoinElement {...aNotificationData} setNotificationsList={setNotificationsList} />
          </DropdownItem>
        </React.Fragment>
      ))}
    </Dropdown>
  );
  async function fetchNotifications() {
    try {
      const response = await axios.get("protected/myNotifications");
      setNotificationsList(response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message);
      } else {
        console.error(error);
      }
    }
  }
}

export default InboxButton;
