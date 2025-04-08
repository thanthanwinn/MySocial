package org.example.springproject.ds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor

public class UserInfoDto {
    private int id;
    private String username;
    private String displayName;
    private String img;
    private String email;
    private String bio;
    private int following;
    private int followers;

    public UserInfoDto(int id, String username, String displayName, String img, String email, String bio, int following, int followers) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.bio = bio;
        this.img= img !=null ? img : null;

    }
}
