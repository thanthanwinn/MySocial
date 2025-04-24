package org.example.springproject.ds;

import lombok.*;
import org.example.springproject.service.RelationsService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Base64;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {

    private int id;
    private String username;
    private String displayName;
    private String img;
    private String email;
    private String bio;
    private int following;
    private int followers;

}
