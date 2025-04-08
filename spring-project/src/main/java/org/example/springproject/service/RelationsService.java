package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.RelationsDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.RelationsDto;
import org.example.springproject.ds.UserInfoDto;
import org.example.springproject.ds.UserRealtionshipDto;
import org.example.springproject.ds.UserRelationDto;
import org.example.springproject.entity.NotificationType;
import org.example.springproject.entity.RelationType;
import org.example.springproject.entity.Relations;
import org.example.springproject.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.example.springproject.entity.RelationType.*;
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
        var relation = relationsDao.findByFollowerAndFollowedUser(userId, friendId).orElse(null);
        if (relation == null) {
            System.out.println("user not found using null");
            return null;
        }
        System.out.println("relation is successfully");
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
        var relation = getExistingRelation(follower.getId(), followee.getId());
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
        dto.setStatus(relation.getType().toString());
        dto.setCreatedAt(relation.getCreatedAt());
        dto.setUpdatedAt(relation.getUpdatedAt());
        return dto;
    }

    @Transactional
    public RelationsDto makeRequest(int userId, int friendId, RelationType relationType) {
        validateUsersNotSame(userId, friendId);
        User follower = getUserById(userId);
        User followed = getUserById(friendId);

        Relations currentRelation = getExistingRelation(userId, friendId);
        if (currentRelation != null) {
            RelationType currentType = currentRelation.getType();
            if (currentType == BLOCKED) {
                throw new IllegalStateException("Cannot proceed: " + (userId + " is blocked by " + friendId));
            }
            if (relationType == PENDING && currentType == PENDING) {
                throw new IllegalStateException("Friend request already pending between " + userId + " and " + friendId);
            }
            if (relationType == ACCEPTED && currentType != PENDING) {
                throw new IllegalStateException("Cannot accept: no pending request from " + userId + " to " + friendId);
            }
            if (relationType == PENDING && (currentType == FOLLOW || currentType == ACCEPTED)) {
                throw new IllegalStateException("Cannot send friend request: already following or friends with " + friendId);
            }
            // Update existing relation
            currentRelation.setType(relationType);
            currentRelation.setUpdatedAt(LocalDateTime.now());
            Relations savedRelation = relationsDao.save(currentRelation);
            updateUserRelations(follower, followed, savedRelation);
            return convertToRelationDto(savedRelation);
        }

        // Check if the reverse relation is BLOCKED
        Relations reverseRelation = getExistingRelation(friendId, userId);
        if (reverseRelation != null && reverseRelation.getType() == BLOCKED) {
            throw new IllegalStateException("Cannot proceed: " + friendId + " has blocked " + userId);
        }

        // Create new relation
        Relations newRelation = new Relations();
        newRelation.setFollower(follower);
        newRelation.setFollowedUser(followed);
        newRelation.setType(relationType);
        newRelation.setCreatedAt(LocalDateTime.now());
        newRelation.setUpdatedAt(LocalDateTime.now());

        Relations savedRelation = relationsDao.save(newRelation);
        updateUserRelations(follower, followed, savedRelation);
        return convertToRelationDto(savedRelation);
    }

    @Transactional
    public RelationsDto sendFriendRequest(int userId, int friendId) {
        log.info("User {} sending friend request to {}", userId, friendId);

        return makeRequest(userId, friendId, PENDING);
    }

    @Transactional
    public void acceptFriendRequest(int userId, int friendId) {
        log.info("User {} accepting friend request from {}", userId, friendId);
        Relations currentRelation = getExistingRelation(friendId, userId); // Note: friendId sent to userId
        if (currentRelation == null || currentRelation.getType() != PENDING) {
            throw new IllegalStateException("No pending friend request from " + friendId + " to " + userId);
        }
        RelationsDto result = makeRequest(friendId, userId, ACCEPTED);

    }

    @Transactional
    public void cancelFriendRequest(int userId, int friendId) {
        log.info("User {} canceling friend request to {}", userId, friendId);
        Relations relation = getExistingRelation(userId, friendId);
        if (relation == null || relation.getType() != PENDING) {
            throw new IllegalStateException("No pending friend request to cancel from " + userId + " to " + friendId);
        }
        removeRelation(getUserById(userId), getUserById(friendId));
        log.info("Friend request canceled successfully");
    }

    @Transactional
    public String block(int userId, int friendId) {
        log.info("User {} blocking user {}", userId, friendId);
        validateUsersNotSame(userId, friendId);

        // Remove any existing relation
        removeRelation(getUserById(userId), getUserById(friendId));

        // Create or update to BLOCKED
        RelationsDto result = makeRequest(userId, friendId, BLOCKED);
        return "Blocked successfully";
    }

    @Transactional
    public String follow(int followerId, int followeeId) {
        System.out.println("followerId: " + followerId + " followeeId: " + followeeId);
        if (isFollowing(followerId, followeeId)) {
            return "Already following this user";
        }
        RelationsDto result = makeRequest(followerId, followeeId, FOLLOW);
        return "Followed successfully";
    }

    @Transactional
    public void unblock(int userId, int friendId) {
        removeRelation(getUserById(userId), getUserById(friendId));
    }


    @Transactional
    public String unfollow(int userId, int friendId) {
        log.info("Attempting to unfollow: userId={}, friendId={}", userId, friendId);
        Relations currentRelation = getExistingRelation(userId, friendId);
        if (currentRelation == null) {
            log.warn("No relation found to unfollow between userId={} and friendId={}", userId, friendId);
            return "Not following this user";
        }
        if (currentRelation.getType() != BLOCKED) {
            log.info("Removing relation: id={}", currentRelation.getId());
            removeRelation(getUserById(userId), getUserById(friendId));
            return "Unfollowed successfully";
        }
        log.warn("Cannot unfollow blocked user: userId={}, friendId={}", userId, friendId);
        return "Cannot unfollow a blocked user";
    }

    @Transactional(readOnly = true)
    public List<UserRealtionshipDto  > getFollowers(int userId) {
        log.info("Retrieving followers for userId={}", userId);
        User user = getUserById(userId);
        List<Relations> followers = relationsDao.findByFollowedUserAndType(user, RelationType.FOLLOW);
        return followers.stream()
                .map(relation -> new UserRealtionshipDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getFollowedUser().getProfile().getDisplayName(),
                        relation.getType().name(), // convert enum to String
                        relation.getFollowedUser().getProfile().getImg(), // assuming img is here
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }
    @Transactional
    public List<UserRealtionshipDto> getFriends(int userId) {
        User user = getUserById(userId);
        return user.getFollowing().stream()
                .filter(relation -> relation.getType() == RelationType.ACCEPTED)
                .map(relation -> new UserRealtionshipDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getFollowedUser().getProfile().getDisplayName(),
                        relation.getType().name(), // convert enum to String
                        relation.getFollowedUser().getProfile().getImg(), // assuming img is here
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }
    @Transactional
    public List<UserRealtionshipDto> getFriendRequests(int userId) {
        User user = getUserById(userId);
        return user.getFollowing().stream()
                .filter(relation -> relation.getType() == RelationType.PENDING)
                .map(relation -> new UserRealtionshipDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getFollowedUser().getProfile().getDisplayName(),
                        relation.getType().name(), // convert enum to String
                        relation.getFollowedUser().getProfile().getImg(), // assuming img is here
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }



    // Method to get following
    @Transactional(readOnly = true)
    public List<UserRelationDto> getFollowing(int userId) {
        log.info("Retrieving following list for userId={}", userId);
        User user = getUserById(userId);
        return user.getFollowing().stream()
                .filter(relation -> relation.getType() == RelationType.FOLLOW)
                .map(relation -> new UserRelationDto(
                        relation.getFollowedUser().getId(),
                        relation.getFollowedUser().getUsername(),
                        relation.getType().toString(),
                        relation.getCreatedAt()))
                .collect(Collectors.toList());
    }


}