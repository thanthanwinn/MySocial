import React, { useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead } from "../service/user.service";
import { NotificationDto } from "../ds/dto";

export default function NotificationsComponent() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);

  useEffect(() => {
    fetchNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);

  const handleMarkAsRead = (notificationId: number) => {
    markNotificationAsRead(notificationId)
      .then(() => {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
      })
      .catch((err) => console.error("Failed to mark notification as read:", err));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className={`card p-3 mb-2 ${notif.isRead ? "bg-gray-100" : "bg-white"}`}>
            <div className="flex justify-between items-center">
              <div>
                <p>{notif.message}</p>
                <p className="text-sm text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              {!notif.isRead && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}