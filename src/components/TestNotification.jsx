'use client';

import { useEffect } from 'react';

export default function TestNotification() {
  useEffect(() => {
    const notify = () => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('Notification not supported in this browser.');
        return;
      }

      if (Notification.permission === 'granted') {
        try {
          new Notification('🔔 Test Notification', {
            body: 'Bu test notificatsiya. Har 1 minutda yuboriladi.',
          });
        } catch (error) {
          console.error('Notification error:', error);
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            try {
              new Notification('🔔 Test Notification', {
                body: 'Bu test notificatsiya. Har 1 minutda yuboriladi.',
              });
            } catch (error) {
              console.error('Notification error:', error);
            }
          }
        });
      }
    };

    notify();
    const interval = setInterval(notify, 600000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
