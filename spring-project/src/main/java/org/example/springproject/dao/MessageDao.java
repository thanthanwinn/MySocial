package org.example.springproject.dao;

import org.example.springproject.entity.Message;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageDao extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrderBySentAtAsc(User sender, User receiver);
    List<Message> findByReceiverOrderBySentAtDesc(User receiver);
}