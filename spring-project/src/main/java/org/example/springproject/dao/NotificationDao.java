package org.example.springproject.dao;

import org.example.springproject.entity.Notification;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationDao extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverIdAndIsReadFalse(Long receiverId);
}
