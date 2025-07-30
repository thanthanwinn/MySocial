package org.example.springproject.dao;

import org.example.springproject.ds.ChatListDto;
import org.example.springproject.entity.Message;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageDao extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender = :user1 AND m.receiver = :user2) OR " +
            "(m.sender = :user2 AND m.receiver = :user1) " +
            "ORDER BY m.sentAt ASC")
    List<Message> findConversationBetween(@Param("user1") User user1, @Param("user2") User user2);
    List<Message> findByReceiverOrderBySentAtDesc(User receiver);

    @Query("""
        SELECT NEW org.example.springproject.ds.ChatListDto(
            u.id,
            u.username,
            u.profile.img,
            m.content,
            m.sentAt
        )
        FROM Message m
        JOIN User u
            ON ( (m.sender.id = u.id AND m.receiver.id = :userId) 
                 OR (m.receiver.id = u.id AND m.sender.id = :userId) )
        WHERE m.sentAt = (
            SELECT MAX(m2.sentAt)
            FROM Message m2
            WHERE ( (m2.sender.id = :userId AND m2.receiver.id = u.id) 
                    OR (m2.receiver.id = :userId AND m2.sender.id = u.id) )
        )
        ORDER BY m.sentAt DESC
    """)
    List<ChatListDto> getChatListByUserId(@Param("userId") int userId);
}
