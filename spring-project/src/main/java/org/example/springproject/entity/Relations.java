package org.example.springproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(
                name = "unique_user_relation",
                columnNames = {"follower_id", "followed_user_id"}
        )
})
public class Relations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")  // Renamed
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed_user_id")  // Renamed
    private User followedUser;

    @Column(nullable = false)
    private RelationType type;

    @Column(nullable = false)
    private RelationStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Relations relations)) return false;
        return Objects.equals(follower, relations.follower) && Objects.equals(followedUser, relations.followedUser) && type == relations.type;
    }

    @Override
    public int hashCode() {
        return Objects.hash(follower, followedUser, type);
    }


}
