package org.example.springproject.dao;

import org.example.springproject.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostDao extends JpaRepository<Post,Long> {
    @Query("SELECT p FROM Post p WHERE p.author.id = ?1")
    List<Post> findPostsByUserId(int userId);
}
