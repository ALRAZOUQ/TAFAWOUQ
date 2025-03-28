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

// Background notification handler
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "../src/assets/mainLogo.png"
    });
});
