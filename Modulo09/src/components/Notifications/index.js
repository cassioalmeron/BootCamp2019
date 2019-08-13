import React, { useState, useEffect, useMemo } from "react";
import { MdNotifications } from "react-icons/md";
import * as DateFns from "date-fns";
import pt from "date-fns/locale/pt";
import api from "~/services/api";
import {
  Container,
  Badge,
  NotificationList,
  Notification,
  Scroll,
} from "./styles";

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const hasUnread = useMemo(
    () => !!notifications.find(notification => notification.read === false),
    [notifications]
  );

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get("notifications");

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: DateFns.formatDistance(
          DateFns.parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
      }));

      setNotifications(data);
    }

    loadNotifications();
  }, []);

  function handleToogleVisible() {
    setVisible(!visible);
    console.tron.log(visible);
  }

  async function handleMarkAsRead(id) {
    await api.put(`notifications/${id}`);

    const notificationsAtualizadas = notifications.map(notification =>
      notification._id === id ? { ...notification, read: true } : notification
    );
    setNotifications(notificationsAtualizadas);
  }

  return (
    <Container>
      <Badge onClick={handleToogleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notification => (
            <Notification key={notification._id} unread={!notification.read}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance}</time>
              {!notification.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
