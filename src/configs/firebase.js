import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-home-95086.firebaseapp.com",
  projectId: "smart-home-95086",
  storageBucket: "smart-home-95086.firebasestorage.app",
  messagingSenderId: "151999544510",
  appId: "1:151999544510:web:ac5db68de18705d305f2ef",
  measurementId: "G-1JVCJCL67X",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.log("Không lấy được token (có thể do lỗi mạng hoặc config).");
        return null;
      }
    } else {
      console.log("Người dùng từ chối quyền thông báo.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy FCM Token:", error);
    return null;
  }
};

export const onMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
