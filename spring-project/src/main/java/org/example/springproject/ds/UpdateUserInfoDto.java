package org.example.springproject.ds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor

public class UpdateUserInfoDto {
    private int id;
    private String username;
    private String displayName;
    private String img;
    private String bio;

    public UpdateUserInfoDto( int id,String username, String displayName, String img, String bio) {
        this.username = username;
        this.id = id;
        this.displayName = displayName;
        this.img = img !=null ? img : null;

        this.bio = bio;
    }
}
