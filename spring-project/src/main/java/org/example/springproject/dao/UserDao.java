package org.example.springproject.dao;

import org.example.springproject.entity.RelationStatus;
import org.example.springproject.entity.RelationType;
import org.example.springproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserDao extends JpaRepository<User,Integer> {
    Optional<User> findUserById(int id);

    @Query("select u from User u where u.username=?1")
    Optional<User> findUserByUsername(String username);

    @Query("SELECT COUNT(r) > 0 FROM Relations r " + "WHERE " +
            "r.follower.id = :followerId AND r.followedUser.id = :followeeId")
    boolean existsFollowingRelation
            (@Param("followerId") int followerId, @Param("followeeId") int followeeId);

    @Query("SELECT COUNT(f) FROM Relations f WHERE f.follower.id = :userId AND f.type = :type")
    int countFollowingByUserId(@Param("userId") int userId, @Param("type") RelationType type);

    // Convenience method to use FOLLOW by default
    @Query("SELECT COUNT(r) FROM Relations r WHERE (r.status = :friend AND (r.followedUser.id = :userId OR r.follower.id = :userId) OR (r.status = :active AND r.follower.id = :userId) OR (r.status = :pending AND r.follower.id = :userId))")
    int userFollowing(@Param("userId") int userId, @Param("friend") RelationStatus friend, @Param("active")RelationStatus active, @Param("pending")RelationStatus pending); ;

    @Query("SELECT COUNT(r) FROM Relations r WHERE (r.status = :friend AND (r.followedUser.id = :userId OR r.follower.id = :userId) OR (r.status = :active AND r.followedUser.id = :userId) OR (r.status = :pending AND r.followedUser.id = :userId))")
    int userFollowers(@Param("userId") int userId, @Param("friend") RelationStatus friend, @Param("active")RelationStatus active, @Param("pending")RelationStatus pending); ;



    @Query("SELECT COUNT(f) FROM Relations f WHERE f.followedUser.id = :userId AND f.type IN (:followType, :acceptedType)")
    int countFollowersById(@Param("userId") int userId,
                               @Param("followType") RelationType followType,
                               @Param("acceptedType") RelationType acceptedType);

    @Query("select u.id from User u where u.username = ?1")
    int getIdByUsername(String username);
    @Query("select u.username from User u where u.id=?1")
    String getUsernameById(int userId);


}
