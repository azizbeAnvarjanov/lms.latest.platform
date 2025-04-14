"use client";
import { useEffect } from "react";

const NotificationPermission = () => {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Bildirishnoma ruxsati:", permission);
      });
    }
  }, []);

  return null; // Bu komponent UIda ko'rinmaydi, faqat ruxsat so'raydi
};

export default NotificationPermission;
