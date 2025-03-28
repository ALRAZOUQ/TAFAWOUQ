import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "../api/axios";
import detectDeviceType from "../util/detectDeviceType";
// 🔹 Replace with your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyBECPdK4UR5mUgUmxKYToPV5CslLp2ubcY",
    authDomain: "tafawouq-gp.firebaseapp.com",
    projectId: "tafawouq-gp",
    storageBucket: "tafawouq-gp.firebasestorage.app",
    messagingSenderId: "1001924615683",
    appId: "1:1001924615683:web:97e858895bd25a9bc93836",
    measurementId: "G-L78FNMXQQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to request permission for notifications
export const requestNotificationPermissionAndGetTheFCMToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "BKktssn_60oOY41f9ymja2yiTQzHFdm7iEpFxKlodbwDPeN4_IBma0tmC5rsw3Qw-7veT5pr6p-t8CYEJDcaCis" });
        if (token) {
            const storedFCMToken = localStorage.getItem("FCMToken")

            if (storedFCMToken != token) {
                console.log(`============= 🔥🔔 Firebase =============`)
                console.log("FCM Token:", token);
                console.log(`==========================================`)

                const deviceType = detectDeviceType()
                console.log(deviceType)
                await axios.post("protected/RegisterForPushNotifications", { FCMToken: token, deviceType: deviceType })
                localStorage.setItem("FCMToken", token)

            }

        } else {
            console.log("🔴🔥🔔 No token received 🔴");
        }
    } catch (error) {
        console.error("🔥🔔 Error getting FCM token:", error);
    }
};

// Listen for foreground messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Message received:", payload);
            resolve(payload);
        });
    });

export { messaging };
