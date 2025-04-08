package org.example.springproject.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.TreeSet;

@Embeddable
@Getter
@Setter
public class Profile {
    private String displayName;
    private String bio;
    private String  img;

    @ElementCollection
    @CollectionTable(name = "user_interests")
    private Set<String> interests = new TreeSet<String>();
}
