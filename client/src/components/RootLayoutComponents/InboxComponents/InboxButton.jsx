import React, { useEffect, useState } from "react";
import { Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { Bell } from "lucide-react";
import NotificatoinElement from "./NotificatoinElement";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { requestNotificationPermissionAndGetTheFCMToken } from "@/config/firebase";
import PushNotificationDialog from "./PushNotificationDialog";

function InboxButton() {
  const [hasUnreaded, setHasUnreaded] = useState(true);
  const [notificationsList, setNotificationsList] = useState([]);
  const [showDialog, setShowDialog] = useState(false); //dirty code to test
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setHasUnreaded(notificationsList.some((aNotificationData) => aNotificationData.readed == false));
  }, [notificationsList]);
  useEffect(() => {
    //dirty code to test
    if (showDialog == true) {
      setTimeout(() => {
        setShowDialog(false);
      }, 10000);
    }
  }, [showDialog]);

  return (
    <div className="flex justify-center">
      <Dropdown
        arrowIcon={false}
        className="cursor-pointer rounded-3xl "
        label={
          <>
            {hasUnreaded && (
              <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-[3px] start-0 dark:border-gray-900"></div>
            )}
            <Bell className="w-5 h-5 fill-current text-gray-500" />
          </>
        }>
        <DropdownHeader className="cursor-default">
          <span
            className="block text-xl text-center"
            onClick={() => {
              setShowDialog(true);
              console.log("showDialog :>> ", showDialog);
            }}>
            التنبيهات
          </span>
        </DropdownHeader>

        {notificationsList.length == 0 ? (
          <DropdownItem className={` w-full`}>لا يوجد لديك إشعارات حاليا </DropdownItem>
        ) : (
          notificationsList.map((aNotificationData) => (
            <React.Fragment key={aNotificationData.id}>
              <hr />
              <DropdownItem className={`${!aNotificationData.readed && "bg-blue-50"} cursor-pointer w-full`}>
                <NotificatoinElement {...aNotificationData} setNotificationsList={setNotificationsList} />
              </DropdownItem>
            </React.Fragment>
          ))
        )}
      </Dropdown>
      {/* //dirty code to test */}
      {showDialog && <PushNotificationDialog openIt={true} />}
    </div>
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
