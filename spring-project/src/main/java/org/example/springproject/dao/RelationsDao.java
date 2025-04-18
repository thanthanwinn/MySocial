package org.example.springproject.dao;

import org.example.springproject.entity.RelationStatus;
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

    Optional<Relations> findByFollowerIdAndFollowedUserIdAndStatus(
            int followerId, int followedUserId, RelationStatus status);

    List<Relations> findByFollowedUserIdAndStatusAndType(
            int followedUserId, RelationStatus status, RelationType type);

    @Query("SELECT r FROM Relations r WHERE r.follower.id = :followerId AND r.followedUser.id = :followeeId")
    Optional<Relations> findByFollowerAndFollowedUser(
            @Param("followerId") int followerId,
            @Param("followeeId") int followeeId);

    List<Relations> findByFollowedUserAndType(User user, RelationType type);
    @Query("SELECT r.follower FROM Relations r WHERE r.followedUser.id = :userId AND r.status = :status")
    List<User> findUsersWhoSendFriendRequestsByUserId(@Param("userId") int userId,@Param("status") RelationStatus status );

    @Query("SELECT r.type FROM Relations r WHERE " +
            "r.follower= :follower AND r.followedUser = :followedUser")
    Optional<RelationType> findRelationTypeByUsers(
            @Param("follower") User follower,
            @Param("followedUser") User followedUser);
    @Query("SELECT r FROM Relations r WHERE (r.follower.id = :userId OR r.followedUser.id = :userId) AND r.status = :type")
    List<Relations> findRelationsByUserIdAndType(@Param("userId") int userId, @Param("type") RelationStatus type);

    @Query("SELECT u FROM User u WHERE u.id != :userId AND " +
            "NOT EXISTS (" +
            "  SELECT r FROM Relations r " +
            "  WHERE (r.follower.id = :userId AND r.followedUser.id = u.id) " +
            "     OR (r.follower.id = u.id AND r.followedUser.id = :userId)" +
            ")")
    List<User> findUsersWithNoRelation(@Param("userId") int userId);


}


