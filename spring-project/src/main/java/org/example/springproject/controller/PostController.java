package org.example.springproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.CommentDto;
import org.example.springproject.ds.CreateCommentDto;
import org.example.springproject.ds.CreatePostDto;
import org.example.springproject.ds.PostDto;
import org.example.springproject.entity.User;
import org.example.springproject.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping("/create")
    public ResponseEntity<PostDto> createPost(
            @RequestBody @Valid CreatePostDto postDto,
            @RequestHeader("X-User-Id") String userId) {
        PostDto createdPost = postService.createPost(postDto, Integer.parseInt(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        PostDto post = postService.getPostById(postId, Integer.parseInt(userId));
        return ResponseEntity.ok(post);
    }
    @GetMapping("/user-posts/{userid}/{viewerid}")
    public ResponseEntity<List<PostDto>> getPostsByUserId(@PathVariable("userid") int userId, @PathVariable("viewerid") int viewerId) {
        List<PostDto> posts = postService.getPostsByUserId(userId,viewerId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(
            @RequestHeader("X-User-Id") String userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PostDto> posts = postService.getVisiblePosts(Integer.parseInt(userId), pageable);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long postId,
            @RequestBody @Valid CreateCommentDto commentDto,
            @RequestHeader("X-User-Id") String userId) {
        CommentDto comment = postService.addCommentToPost(postId, commentDto, Integer.parseInt(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getPostComments(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        List<CommentDto> comments = postService.getPostComments(postId, Integer.parseInt(userId));
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.likePost(postId, Integer.parseInt(userId));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/unlike")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.unlikePost(postId, Integer.parseInt(userId));
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/{postId}/share")
//    public ResponseEntity<Void> sharePost(
//            @PathVariable Long postId,
//            @RequestHeader("X-User-Id") String userId,
//            @RequestParam(required = false) String receiverId) {
//        if (receiverId == null || receiverId.isEmpty()) {
//            throw new IllegalArgumentException("Receiver ID is required for sharing");
//        }
//        postService.sharePost(postId, Integer.parseInt(userId), Integer.parseInt(receiverId));
//        return ResponseEntity.status(HttpStatus.CREATED).build();
//    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.deletePost(postId, Integer.parseInt(userId));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{postId}/visibility")
    public ResponseEntity<PostDto> updatePostVisibility(
            @PathVariable Long postId,
            @RequestBody String newVisibility,
            @RequestHeader("X-User-Id") String userId) {
        PostDto updatedPost = postService.updatePostVisibility(postId, newVisibility, Integer.parseInt(userId));
        return ResponseEntity.ok(updatedPost);
    }

    @GetMapping("/{postId}/likes")
    public ResponseEntity<List<User>> getPostLikes(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") String userId) {
        List<User> likes = postService.getPostLikes(postId, Integer.parseInt(userId));
        return ResponseEntity.ok(likes);
    }
}