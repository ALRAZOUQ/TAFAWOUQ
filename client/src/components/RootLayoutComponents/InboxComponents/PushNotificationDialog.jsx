"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BellRing } from "lucide-react";
import { requestNotificationPermissionAndGetTheFCMToken } from "@/config/firebase";

export default function PushNotificationDialog({ openIt = false }) {
  console.log("openIt :>> ", openIt);
  const [open, setOpen] = useState(openIt);

  useEffect(() => {
    // Check if we should show the notification dialog
    // This is where you'd put your condition, for example:
    const shouldShowNotificationPrompt = !sessionStorage.getItem("notificationsPrompted");

    if (openIt || (shouldShowNotificationPrompt && Notification.permission == "default")) {
      setOpen(true);
    }
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2 ">
            <BellRing className="size-8 text-blue-500 me-2" />
            <AlertDialogTitle>هل نخبرك عندما يرد أحدهم على تعليقاتك؟</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-semibold rounded-xl me-4 text-md" onClick={handleCancel}>
            ليس الآن
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-semibold rounded-xl bg-blue-700 text-md "
            onClick={handleAllowNotifications}>
            بالطبع أخبرني!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  function handleAllowNotifications() {
    // Request notification permission
    requestNotificationPermissionAndGetTheFCMToken();
    setOpen(false);

    // Store that we've prompted the user
    sessionStorage.setItem("notificationsPrompted", "true");
  }

  function handleCancel() {
    // Store that we've prompted the user even if they declined
    sessionStorage.setItem("notificationsPrompted", "true");
    setOpen(false);
  }
}
