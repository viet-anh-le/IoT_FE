importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCkiqMuL9ap00nVMMGknZGM2a4rP01EoC0",
  authDomain: "smart-home-95086.firebaseapp.com",
  projectId: "smart-home-95086",
  storageBucket: "smart-home-95086.firebasestorage.app",
  messagingSenderId: "151999544510",
  appId: "1:151999544510:web:ac5db68de18705d305f2ef",
  measurementId: "G-1JVCJCL67X",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
