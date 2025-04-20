
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");

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
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


// TODO Razouq: ALL OF THIS IS USELESS, AI IS DUMP!!!!!!!!
// Background notification handler
// messaging.onBackgroundMessage((payload) => {
//     console.log("Received background message:", payload);
//     const { title, body } = payload.notification;
//     const url = payload.data?.url || "https://www.google.com/"; // Default to home if no URL is provided


//     self.registration.showNotification(title, {
//         body,
//         icon: "./mainLogo.png",
//         data: { url } // Store URL in notification data
//     });
// });

// // 🔔 Handle click on notification
// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();
//     const targetUrl = event.notification.data?.url || "/"; // Use stored URL or default
//     console.log(targetUrl);
//     event.waitUntil(
//         clients
//             .matchAll({ type: "window", includeUncontrolled: true })
//             .then((clientList) => {
//                 for (const client of clientList) {
//                     if (client.url === targetUrl && "focus" in client) {
//                         return client.focus();
//                     }
//                 }
//                 return clients.openWindow(targetUrl); // Open new tab if not already open
//             })
//     );
// }); 