package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.CommentDao;
import org.example.springproject.dao.PostDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.CommentDto;
import org.example.springproject.ds.CreateCommentDto;
import org.example.springproject.ds.CreatePostDto;
import org.example.springproject.ds.PostDto;
import org.example.springproject.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostDao postDao;
    private final CommentDao commentDao;
    private final UserDao userDao;
    private final RelationsService relationsService;

    @Transactional
    public PostDto createPost(CreatePostDto postDto, int userId) {
        User author = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setContent(postDto.getContent());
        post.setAuthor(author);
        if(postDto.getVisibility().toString().equals("PUBLIC")){
            post.setVisibility(Visibility.PUBLIC);
        }else if(postDto.getVisibility().toString().equals("PRIVATE")){
            post.setVisibility(Visibility.PRIVATE);
        }else if(postDto.getVisibility().toString().equals("FRIENDS")){
            post.setVisibility(Visibility.FRIENDS);
        }
        post.setCreatedAt(LocalDateTime.now());

        Post savedPost = postDao.save(post);
        return convertToDto(savedPost,userId);
    }

    @Transactional(readOnly = true)
    public PostDto getPostById(Long postId, int viewerId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (canViewPost(post, viewerId)) {
            return convertToDto(post,viewerId);
        }
        throw new SecurityException("You do not have permission to view this post");
    }
    @Transactional(readOnly = true)
    public List<PostDto> getPostsByUserId(int userId,int viewerId){
         return postDao.findPostsByUserId(userId)
                 .stream()
                 .filter(post -> canViewPost(post, viewerId))
                 .map(p -> convertToDto(p,viewerId))                 .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PostDto> getVisiblePosts(int viewerId, Pageable pageable) {
        Page<Post> posts = postDao.findAll(pageable);
        List<PostDto> filteredAndMapped = posts.stream()
                .filter(post -> canViewPost(post, viewerId))
                .map(p -> convertToDto(p,viewerId))
                .collect(Collectors.toList());

        return new PageImpl<>(filteredAndMapped, pageable, posts.getTotalElements());
    }

    @Transactional
    public CommentDto addCommentToPost(Long postId, CreateCommentDto commentDto, int userId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!canViewPost(post, userId)) {
            throw new SecurityException("You do not have permission to comment on this post");
        }
        User author = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentDao.save(comment);
        return convertToCommentDto(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId, int viewerId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!canViewPost(post, viewerId)) {
            throw new SecurityException("You do not have permission to view comments on this post");
        }
        return post.getComments().stream()
                .map(this::convertToCommentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void likePost(Long postId, int userId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!canViewPost(post, userId)) {
            throw new SecurityException("You do not have permission to like this post");
        }

        if (!post.getLikedByUsers().contains(user)) {
            post.getLikedByUsers().add(user);
            System.out.println("liking post");
            postDao.save(post);
        } else {
            throw new RuntimeException("User has already liked this post");
        }
    }

    @Transactional
    public void unlikePost(Long postId, int userId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!canViewPost(post, userId)) {
            throw new SecurityException("You do not have permission to unlike this post");
        }

        if (post.getLikedByUsers().contains(user)) {
            post.getLikedByUsers().remove(user);
            System.out.println("unliking post");
            postDao.save(post);
        } else {
            throw new RuntimeException("User has not liked this post");
        }
    }

//    @Transactional
//    public void sharePost(Long postId, int userId, int receiverId) {
//        Post post = postDao.findById(postId)
//                .orElseThrow(() -> new RuntimeException("Post not found"));
//        User sharer = userDao.findById(userId)
//                .orElseThrow(() -> new RuntimeException("Sharer not found"));
//        User receiver = userDao.findById(receiverId)
//                .orElseThrow(() -> new RuntimeException("Receiver not found"));
//
//        if (!canViewPost(post, userId)) {
//            throw new SecurityException("You do not have permission to share this post");
//        }
//
//        Share share = new Share();
//        share.setSharer(sharer);
//        share.setReceiver(receiver);
//        share.setPost(post);
//        share.setSharedAt(LocalDateTime.now());
//
//        // Assume you have a ShareDao or similar
//        // shareDao.save(share);
//    }

    @Transactional
    public void deletePost(Long postId, int userId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getAuthor().getId() != userId) {
            throw new SecurityException("Only the author can delete this post");
        }

        postDao.delete(post);
    }

    @Transactional
    public PostDto updatePostVisibility(Long postId, String newVisibility, int userId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getAuthor().getId() != userId) {
            throw new SecurityException("Only the author can update this post's visibility");
        }

        Visibility visibility = switch (newVisibility.toUpperCase()) {
            case "PUBLIC" -> Visibility.PUBLIC;
            case "PRIVATE" -> Visibility.PRIVATE;
            case "FRIENDS" -> Visibility.FRIENDS;
            default -> throw new IllegalArgumentException("Invalid visibility value");
        };

        post.setVisibility(visibility);
        Post updatedPost = postDao.save(post);
        return convertToDto(updatedPost,userId);
    }

    @Transactional(readOnly = true)
    public List<User> getPostLikes(Long postId, int viewerId) {
        Post post = postDao.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!canViewPost(post, viewerId)) {
            throw new SecurityException("You do not have permission to view likes for this post");
        }

        return post.getLikedByUsers().stream().toList();
    }

    // Visibility check
    private boolean canViewPost(Post post, int viewerId) {
        User viewer = userDao.findById(viewerId)
                .orElseThrow(() -> new RuntimeException("Viewer not found"));
        User author = post.getAuthor();
        Visibility visibility = post.getVisibility();
        if (viewer.getId() == author.getId()) {
            return true; // Author can always view their own post
        }
        // Blocked check
        Relations blockRelation = relationsService.getExistingRelation(author.getId(), viewerId);
        if (blockRelation != null && blockRelation.getType() == RelationType.BLOCKED) {
            return false; // Viewer is blocked by author
        }

        return switch (visibility) {
            case PUBLIC -> true; // Anyone can see
            case PRIVATE -> viewer.getId() == author.getId(); // Only author can see
            case FRIENDS -> {
                Relations relation = relationsService.getExistingRelation(viewer.getId(), author.getId());
                yield relation != null && relation.getType() == RelationType.FRIEND  || viewer.getId() == author.getId();
            }
        };
    }

    private PostDto convertToDto(Post post,int userId) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getUsername());
        dto.setAuthorDisplayName(post.getAuthor().getProfile().getDisplayName());
        dto.setImg(post.getAuthor().getProfile().getImg());
        dto.setLikeCount(post.getLikedByUsers().size());
        dto.setLikedBy(post.getLikedByUsers().stream()
                .map(user -> user.getId()) // Map each User to its ID
                .toArray(Integer[]::new));
        dto.setCommentCount(post.getComments().size());
        dto.setVisibility(post.getVisibility().toString());
        dto.setLikedByCurrentUser(post.getLikedByUsers().stream().anyMatch(user -> user.getId() == userId)); // Check if user liked
        return dto;
    }

    private CommentDto convertToCommentDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setAuthorId(comment.getAuthor().getId());
        dto.setAuthorName(comment.getAuthor().getUsername());
        dto.setAuthorDisplayName(comment.getAuthor().getProfile().getDisplayName());
        dto.setImg(comment.getAuthor().getProfile().getImg());
        dto.setPostId(comment.getPost().getId());
        return dto;
    }
}