package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.RelationsDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.RelationsDto;
import org.example.springproject.ds.UserRealtionshipDto;
import org.example.springproject.ds.UserRelationDto;
import org.example.springproject.entity.RelationStatus;
import org.example.springproject.entity.Relations;
import org.example.springproject.entity.RelationType;
import org.example.springproject.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import javax.management.relation.RelationTypeSupport;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RestController
@RequiredArgsConstructor
public class RelationsService {
    private static final Logger log = LoggerFactory.getLogger(RelationsService.class);
    private final UserDao userDao;
    private final RelationsDao relationsDao;
    private final NotificationService notificationService;

    public User getUserById(int userId) {
        return userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    public Relations getExistingRelation(int userId, int friendId) {
        Relations relation = relationsDao.findByFollowerAndFollowedUser(userId, friendId).orElse(null);
        if (relation == null) {
            log.info("No existing relation found for user {} and friend {}", userId, friendId);
            return null;
        }
        log.info("Existing relation found for user {} and friend {}", userId, friendId);
        return relation;
    }

    private boolean isFollowing(int followerId, int followeeId) {
        return userDao.existsFollowingRelation(followerId, followeeId);
    }

    private void validateUsersNotSame(int userId1, int userId2) {
        if (userId1 == userId2) {
            throw new IllegalArgumentException("Cannot perform action on yourself");
        }
    }

    private void updateUserRelations(User follower, User followee, Relations relation) {
        follower.addFollowing(relation);
        followee.addFollowers(relation);
        userDao.saveAll(List.of(follower, followee));
    }

    private void removeRelation(User follower, User followee) {
        Relations relation = getExistingRelation(follower.getId(), followee.getId());
        if (relation != null) {
            log.info("Removing relation: id={}, followerId={}, followedUserId={}",
                    relation.getId(), follower.getId(), followee.getId());
            follower.removeFollowing(relation);
            followee.removeFollower(relation);
            relationsDao.delete(relation);
            userDao.saveAll(List.of(follower, followee));
            log.info("Relation deleted successfully");
        } else {
            log.warn("No relation found to remove between followerId={} and followeeId={}",
                    follower.getId(), followee.getId());
        }
    }

    private RelationsDto convertToRelationDto(Relations relation) {
        RelationsDto dto = new RelationsDto();
        dto.setId(relation.getId());
        dto.setSenderId(relation.getFollower().getId());
        dto.setSenderName(relation.getFollower().getUsername());
        dto.setRecipientId(relation.getFollowedUser().getId());
        dto.setRecipientName(relation.getFollowedUser().getUsername());
        dto.setStatus(relation.getStatus().toString()); // Now a String: "PENDING", "ACCEPT", or "ACTIVE"
        dto.setCreatedAt(relation.getCreatedAt());
        dto.setUpdatedAt(relation.getUpdatedAt());
        return dto;
    }

    /**
     * Processes relation requests based solely on the desired relation type.
     * The service sets the appropriate status internally:
     * - FRIEND: On creation, status="PENDING"; for an acceptance, status="ACCEPT".
     * - FOLLOW: Sets status="ACTIVE".
     * - BLOCK: No status (set to null).
     */
    @Transactional
    public RelationsDto makeRequest(int userId, int friendId, RelationType relationType) {
        validateUsersNotSame(userId, friendId);
        User follower = getUserById(userId);
        User followed = getUserById(friendId);

        // Retrieve existing relation, if any
        Relations currentRelation = getExistingRelation(userId, friendId);
        if (currentRelation != null) {
            RelationType currentType = currentRelation.getType();
            // Disallow processing if you have been blocked
            if (currentType == RelationType.BLOCKED) {
                throw new IllegalStateException("Cannot proceed: " + userId + " is blocked by " + friendId);
            }
            // If the request is for a friend relation...
            if (relationType == RelationType.FRIEND) {
                // If already pending, do not allow duplicate pending friend request.
                if ("PENDING".equals(currentRelation.getStatus()) && currentType == RelationType.FRIEND) {
                    throw new IllegalStateException("Friend request already pending between " + userId + " and " + friendId);
                }
                // For acceptance: if the relation is pending but the direction is reversed,
                // then update the status to "ACCEPT"
                if ("PENDING".equals(currentRelation.getStatus())) {
                    currentRelation.setStatus(RelationStatus.ACCEPTED);
                    currentRelation.setUpdatedAt(LocalDateTime.now());
                    Relations savedRelation = relationsDao.save(currentRelation);
                    updateUserRelations(follower, followed, savedRelation);
                    return convertToRelationDto(savedRelation);
                }
                // If already friends, disallow sending a friend request again.
                throw new IllegalStateException("Already friends or friend request processed between " + userId + " and " + friendId);
            } else if (relationType == RelationType.FOLLOW) {
                // Do not allow follow action if already following or if already friends.
                if ("ACTIVE".equals(currentRelation.getStatus()) && currentType == RelationType.FOLLOW) {
                    throw new IllegalStateException("Already following this user");
                }
                // Update the existing relation to follow
                currentRelation.setType(RelationType.FOLLOW);
                currentRelation.setStatus(RelationStatus.ACTIVE);
                currentRelation.setUpdatedAt(LocalDateTime.now());
                Relations savedRelation = relationsDao.save(currentRelation);
                updateUserRelations(follower, followed, savedRelation);
                return convertToRelationDto(savedRelation);
            } else if (relationType == RelationType.BLOCKED) {
                // When blocking, remove any existing relation first
                removeRelation(follower, followed);
                // Then create a new block relationship below.
            }
        }

        // Check reverse relation: Do not allow request if the other party has blocked the user.
        Relations reverseRelation = getExistingRelation(friendId, userId);
        if (reverseRelation != null && reverseRelation.getType() == RelationType.BLOCKED) {
            throw new IllegalStateException("Cannot proceed: " + friendId + " has blocked " + userId);
        }

        // Create new relation
        Relations newRelation = new Relations();
        newRelation.setFollower(follower);
        newRelation.setFollowedUser(followed);
        newRelation.setType(relationType);
        if (relationType == RelationType.FRIEND) {
            newRelation.setStatus(RelationStatus.PENDING);
        } else if (relationType == RelationType.FOLLOW) {
            newRelation.setStatus(RelationStatus.ACTIVE);
        } else if (relationType == RelationType.BLOCKED) {
            newRelation.setStatus(null);
        }
        newRelation.setCreatedAt(LocalDateTime.now());
        newRelation.setUpdatedAt(LocalDateTime.now());

        Relations savedRelation = relationsDao.save(newRelation);
        updateUserRelations(follower, followed, savedRelation);
        return convertToRelationDto(savedRelation);
    }

    // Sends a friend request. A new FRIEND relation is created with status "PENDING".
    @Transactional
    public RelationsDto sendFriendRequest(int userId, int friendId) {
        log.info("User {} sending friend request to {}", userId, friendId);
        return makeRequest(userId, friendId, RelationType.FRIEND);
    }

    // Accepts a friend request. It retrieves a pending friend request and changes its status to "ACCEPT".

    @Transactional
    public void acceptFriendRequest(int userId, int friendId) {
        log.info("User {} accepting friend request from {}", userId, friendId);

        // Get the pending request where friendId is the sender (follower)
        // and userId is the recipient (followedUser)
        Relations currentRelation = relationsDao.findByFollowerIdAndFollowedUserIdAndStatus(
                        friendId, userId, RelationStatus.PENDING)
                .orElseThrow(() -> new IllegalStateException("No pending friend request from " + friendId + " to " + userId));

        if (currentRelation.getType() != RelationType.FRIEND) {
            throw new IllegalStateException("Not a friend request");
        }

        currentRelation.setStatus(RelationStatus.ACCEPTED);
        currentRelation.setUpdatedAt(LocalDateTime.now());
        Relations savedRelation = relationsDao.save(currentRelation);
        updateUserRelations(getUserById(friendId), getUserById(userId), savedRelation);

        log.info("Friend request accepted successfully");
    }

    // Cancels an outgoing friend request.
    @Transactional
    public void cancelFriendRequest(int userId, int friendId) {
        log.info("User {} canceling friend request to {}", userId, friendId);
        Relations relation = getExistingRelation(userId, friendId);
        if (relation == null || relation.getType() != RelationType.FRIEND ||
                !"PENDING".equals(relation.getStatus())) {
            throw new IllegalStateException("No pending friend request to cancel from " + userId + " to " + friendId);
        }
        removeRelation(getUserById(userId), getUserById(friendId));
        log.info("Friend request canceled successfully");
    }

    // Blocks a user. It first removes any existing relation and then creates a new BLOCK relation.
    @Transactional
    public String block(int userId, int friendId) {
        log.info("User {} blocking user {}", userId, friendId);
        validateUsersNotSame(userId, friendId);

        removeRelation(getUserById(userId), getUserById(friendId));

        // Create new BLOCK relation – status is left as null.
        makeRequest(userId, friendId, RelationType.BLOCKED);
        return "Blocked successfully";
    }

    // Follows a user. Creates a FOLLOW relation with status "ACTIVE".
    @Transactional
    public String follow(int followerId, int followeeId) {
        log.info("User {} attempting to follow user {}", followerId, followeeId);
        if (isFollowing(followerId, followeeId)) {
            return "Already following this user";
        }
        makeRequest(followerId, followeeId, RelationType.FOLLOW);
        return "Followed successfully";
    }

    @Transactional
    public void unblock(int userId, int friendId) {
        removeRelation(getUserById(userId), getUserById(friendId));
    }

    // Unfollows a user.
    @Transactional
    public String unfollow(int userId, int friendId) {
        log.info("Attempting to unfollow: userId={}, friendId={}", userId, friendId);
        Relations currentRelation = getExistingRelation(userId, friendId);
        if (currentRelation == null) {
            log.warn("No relation found to unfollow between userId={} and friendId={}", userId, friendId);
            return "Not following this user";
        }
        if (currentRelation.getType() != RelationType.BLOCKED) {
            removeRelation(getUserById(userId), getUserById(friendId));
            return "Unfollowed successfully";
        }
        log.warn("Cannot unfollow blocked user: userId={}, friendId={}", userId, friendId);
        return "Cannot unfollow a blocked user";
    }

    // Retrieve followers (for FOLLOW type relations)
    @Transactional(readOnly = true)
    public List<UserRealtionshipDto> getFollowers(int userId) {
        log.info("Retrieving followers for userId={}", userId);
        User user = getUserById(userId);
        List<Relations> followers = relationsDao.findByFollowedUserAndType(user, RelationType.FOLLOW);
        return followers.stream()
                .map(relation -> new UserRealtionshipDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getFollowedUser().getProfile().getDisplayName(),
                        relation.getStatus().toString(), // now shows "ACTIVE"
                        relation.getFollowedUser().getProfile().getImg(),
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // Retrieve friends (accepted friend relations)
    @Transactional
    public List<UserRealtionshipDto> getFriends(int userId) {

        List<Relations> relations = relationsDao.findRelationsByUserIdAndType(userId, RelationStatus.ACCEPTED);
        List<User> friends = new ArrayList<>();
        for (Relations r : relations) {
            if (r.getFollower().getId() == userId) {
                friends.add(r.getFollowedUser());
            } else {
                friends.add(r.getFollower());
            }
        }

        return friends.stream()
                .map(relation -> new UserRealtionshipDto(
                        relation.getId(),
                        relation.getUsername(),
                        relation.getProfile().getDisplayName(),
                        relation.toString(),
                        relation.getProfile().getImg(),
                        LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    // Retrieve friend requests that are still pending.
    @Transactional
    public List<UserRealtionshipDto> getFriendRequests(int userId) {
        // Find requests where current user is the recipient (followedUser)
        // and status is PENDING
        List<Relations> requests = relationsDao.findByFollowedUserIdAndStatusAndType(
                userId, RelationStatus.PENDING, RelationType.FRIEND);

        return requests.stream()
                .map(relation -> new UserRealtionshipDto(
                        relation.getFollower().getId(),
                        relation.getFollower().getUsername(),
                        relation.getFollower().getProfile().getDisplayName(),
                        relation.getStatus().toString(),
                        relation.getFollower().getProfile().getImg(),
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // Retrieve following list for follow relations.
    @Transactional(readOnly = true)
    public List<UserRelationDto> getFollowing(int userId) {
        log.info("Retrieving following list for userId={}", userId);
        User user = getUserById(userId);
        return user.getFollowing().stream()
                .filter(relation -> relation.getType() == RelationType.FOLLOW &&
                        "ACTIVE".equals(relation.getStatus()))
                .map(relation -> new UserRelationDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getType().toString(),
                        relation.getStatus().toString(),
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
