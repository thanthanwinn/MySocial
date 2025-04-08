package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.NotificationDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.NotificationDto;
import org.example.springproject.entity.Notification;
import org.example.springproject.entity.NotificationType;
import org.example.springproject.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private  final NotificationDao notificationRepository;

    public void createNotification(Long senderId, Long receiverId, String type, String message) {
        Notification notification = new Notification();
        notification.setSenderId(senderId);
        notification.setReceiverId(receiverId);
        notification.setType(type);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<NotificationDto> getUnreadNotifications(Long receiverId) {
        return notificationRepository.findByReceiverIdAndIsReadFalse(receiverId)
                .stream()
                .map(n -> convertNotificationToDto(n))
                .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public NotificationDto convertNotificationToDto(Notification notification) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(notification.getId());
        notificationDto.setSenderId(notification.getSenderId());
        notificationDto.setReceiverId(notification.getReceiverId());
        notificationDto.setType(notification.getType());
        notificationDto.setMessage(notification.getMessage());
        return notificationDto;
    }
}