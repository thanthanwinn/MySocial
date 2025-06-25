package org.example.springproject.dao;

import org.example.springproject.ds.ChatListDto;
import org.example.springproject.entity.Message;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageDao extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrderBySentAtAsc(User sender, User receiver);
    List<Message> findByReceiverOrderBySentAtDesc(User receiver);
    @Query("""
    SELECT new org.example.springproject.ds.ChatListDto(
        CASE 
            WHEN m.sender.id = :userId THEN m.receiver.id
            ELSE m.sender.id
        END,
        CASE 
            WHEN m.sender.id = :userId THEN m.receiver.username
            ELSE m.sender.username
        END,
        CASE 
            WHEN m.sender.id = :userId THEN m.receiver.profile.img
            ELSE m.sender.profile.img
        END,
        m.content,
        m.sentAt
    )
    FROM Message m
    WHERE m.sentAt = (
        SELECT MAX(m2.sentAt)
        FROM Message m2
        WHERE 
            (m2.sender.id = m.sender.id AND m2.receiver.id = m.receiver.id)
            OR
            (m2.sender.id = m.receiver.id AND m2.receiver.id = m.sender.id)
    )
    AND (:userId = m.sender.id OR :userId = m.receiver.id)
    ORDER BY m.sentAt DESC
""")
    List<ChatListDto> getChatListByUserId(@Param("userId") int userId);





}