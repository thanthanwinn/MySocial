package org.example.springproject.dao;

import org.example.springproject.entity.RelationType;
import org.example.springproject.entity.Relations;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface RelationsDao extends JpaRepository<Relations, Long> {
    @Query("select r from Relations r where r.followedUser = ?2 and r.follower = ?1")
    Optional<Relations> findRelationsByFollowerAndFollowedUser(User follower, User followedUser);

    @Query("SELECT r FROM Relations r WHERE r.follower.id = :followerId AND r.followedUser.id = :followeeId")
    Optional<Relations> findByFollowerAndFollowedUser(
            @Param("followerId") int followerId,
            @Param("followeeId") int followeeId);

    List<Relations> findByFollowedUserAndType(User user, RelationType type);

    // Check if relationship exists
    boolean existsByFollowerAndFollowedUser(User follower, User followedUser);

    @Query("SELECT r.type FROM Relations r WHERE " +
            "r.follower= :follower AND r.followedUser = :followedUser")
    Optional<RelationType> findRelationTypeByUsers(
            @Param("follower") User follower,
            @Param("followedUser") User followedUser);

    @Query("SELECT u FROM User u WHERE u.id != :userId AND " +
            "NOT EXISTS (" +
            "  SELECT r FROM Relations r " +
            "  WHERE (r.follower.id = :userId AND r.followedUser.id = u.id) " +
            "     OR (r.follower.id = u.id AND r.followedUser.id = :userId)" +
            ")")
    List<User> findUsersWithNoRelation(@Param("userId") int userId);


}


