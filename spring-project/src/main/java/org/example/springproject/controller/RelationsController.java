package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.UserRelationshipDto;
import org.example.springproject.service.RelationsService;
import org.example.springproject.ds.RelationsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relations")
@RequiredArgsConstructor
public class RelationsController {
    private final RelationsService relationsService;
    @GetMapping("/friends")
    public ResponseEntity<List<UserRelationshipDto>> getFriends(@RequestHeader("X-User-Id")String userId){
        List<UserRelationshipDto> friends = relationsService.getFriends(Integer.parseInt(userId));
        return ResponseEntity.ok(friends);
    }
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<UserRelationshipDto>> getFriends(@PathVariable("userId")int userId){
        List<UserRelationshipDto> friends = relationsService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }
    @GetMapping("/friends-requests")
    public ResponseEntity<List<UserRelationshipDto>> getFriendRequests(@RequestHeader("X-User-Id")String userId){
        List<UserRelationshipDto> friends = relationsService.getFriendRequests(Integer.parseInt(userId));
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/followers/{id}")
   public  ResponseEntity<List<UserRelationshipDto>> getFollowers(@PathVariable("id")int id) {
        List<UserRelationshipDto> followers = relationsService.getFollowers(id);
        return ResponseEntity.ok(followers);
    }

    // New endpoint to see following
    @GetMapping("/followings/{id}")
    public ResponseEntity<List<UserRelationshipDto>> getFollowing(@PathVariable("id")int id) {
        List<UserRelationshipDto> following = relationsService.getFollowing(id);
        return ResponseEntity.ok(following);
    }

    @PostMapping("/request/{friendId}")
    public ResponseEntity<RelationsDto> sendFriendRequest(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        return ResponseEntity.ok(relationsService.sendFriendRequest(Integer.parseInt(userId), friendId));
    }

    @PutMapping("/accept/{friendId}")
    public ResponseEntity<Void> acceptFriendRequest(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        relationsService.acceptFriendRequest(Integer.parseInt(userId), friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cancel/{friendId}")
    public ResponseEntity<Void> cancelFriendRequest(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        relationsService.cancelFriendRequest(Integer.parseInt(userId), friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/follow/{followeeId}")
    public ResponseEntity<String> followUser(
            @RequestHeader("X-User-Id") String followerId,
            @PathVariable int followeeId) {
        System.out.println(" followed by " + followerId );
        return ResponseEntity.ok(relationsService.follow(Integer.parseInt(followerId), followeeId));
    }

    @PostMapping("/block/{friendId}")
    public ResponseEntity<String> blockUser(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        return ResponseEntity.ok(relationsService.block(Integer.parseInt(userId), friendId));
    }

    @DeleteMapping("/unblock/{friendId}")
    public ResponseEntity<Void> unblockUser(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        relationsService.unblock(Integer.parseInt(userId), friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow/{friendId}")
    public ResponseEntity<String> unfollowUser(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable int friendId) {
        return ResponseEntity.ok(relationsService.unfollow(Integer.parseInt(userId), friendId));
    }
    @GetMapping("/count-followers/{id}")
    public int countFollowers(@PathVariable("id")int id){
        return relationsService.getCountFollowers( id);
    }
    @GetMapping("/count-followings/{id}")
    public int countFollowings(@PathVariable("id")int id){
        return relationsService.getCountFollowings(id);
    }
}