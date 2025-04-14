'use client';

import { useEffect } from 'react';

export default function TestNotification() {
  useEffect(() => {
    const notify = () => {
      if (!("Notification" in window)) {
        console.log("Browser does not support notifications.");
        return;
      }

      if (Notification.permission === "granted") {
        new Notification("🔔 Test Notification", {
          body: "Bu test notificatsiya. Har 1 minutda yuboriladi.",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("🔔 Test Notification", {
              body: "Bu test notificatsiya. Har 1 minutda yuboriladi.",
            });
          }
        });
      }
    };

    // Dastlab darhol chaqiriladi
    notify();

    // Har 60 soniyada chaqiriladi
    const interval = setInterval(notify, 60000);

    // Component unmount bo‘lsa interval to‘xtatiladi
    return () => clearInterval(interval);
  }, []);

  return null;
}
