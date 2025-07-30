package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.UpdateUserInfoDto;
import org.example.springproject.ds.UserInfoDto;
import org.example.springproject.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;



    @GetMapping("/id/{userId}")
    public ResponseEntity<UserInfoDto> getUserInfo(@PathVariable("userId")int userId) {
        return ResponseEntity.ok(userService.getUserInfo(userId));
    }
    @GetMapping("/user-no-relations")
    public ResponseEntity<List<UserInfoDto>> getUsersWithoutRelations(@RequestHeader("X-User-Id") String userId) {
       var res =  userService.getUsersNoRelationWithCurrentUser(Integer.parseInt(userId));
       return ResponseEntity.ok(res);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserInfoDto> getUserInfo(@PathVariable("username")String username) {
        return ResponseEntity.ok(userService.getUserInfo(username));
    }



    @PutMapping(value = "/update")
    public ResponseEntity<UpdateUserInfoDto> updateUserInfo(
            @RequestHeader("X-User-Id") String  userId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String displayName,
            @RequestParam(required = false) String  img
    ) throws IOException {
        return ResponseEntity.ok(
                userService.updateUserInfo(Integer.parseInt(userId), username, bio, displayName, img)
        );
    }


}