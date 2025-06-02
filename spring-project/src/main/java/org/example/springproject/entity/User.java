package org.example.springproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)

    private String username;

    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Embedded
    private Profile profile;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "author",fetch = FetchType.EAGER)
    private List<Post> posts;

    // Relationships mapped by Relationship entity
    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY,cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Relations> following = new HashSet<>(); // Users this user follows

    @OneToMany(mappedBy = "followedUser" +
            "",fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Relations> followers = new HashSet<>(); // Users following this user

    public void addRole(Role role) {
        this.roles.add(role);
    }


    public List<User> getFollowersList() {
        return followers.stream()
                .map(Relations::getFollower) // Correct: followers are those who follow this user
                .toList();
    }

    public List<User> getFollowingList() {
        return following.stream()
                .map(Relations::getFollowedUser) // Correct: following are those this user follows
                .toList();
    }

    public void addFollowing(Relations relations) {
        this.following.add(relations);
    }
    public void removeFollowing(Relations relations) {
        this.following.remove(relations);
    }

    public void addFollowers(Relations relations) {
        this.followers.add(relations);
    }

    public void removeFollower(Relations relations){
        this.followers.remove(relations);
    }


    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    public User(String username, Profile profile) {
        this.username = username;
        this.profile = profile;
    }
}

