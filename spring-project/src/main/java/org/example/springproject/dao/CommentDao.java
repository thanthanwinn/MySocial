package org.example.springproject.dao;

import org.example.springproject.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentDao extends JpaRepository<Comment, Long> {
    Optional<Comment> findByPostId(Long postId);
}
