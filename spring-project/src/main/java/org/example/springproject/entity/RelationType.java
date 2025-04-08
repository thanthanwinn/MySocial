package org.example.springproject.entity;

import lombok.Setter;


public enum RelationType {
    PENDING,// Friend request sent
    FOLLOW,// can see that user public posts
    ACCEPTED,  // Now friends
    BLOCKED    // User blocked
}
