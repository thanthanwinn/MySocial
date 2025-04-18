package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.RelationsDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.UpdateUserInfoDto;
import org.example.springproject.ds.UserInfoDto;
import org.example.springproject.entity.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.Serial;
import java.security.Security;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.example.springproject.entity.RelationType.FOLLOW;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserDao userDao;
    private final RelationsDao relationsDao;

    public UpdateUserInfoDto updateUserInfo(
            int userId,
            String username,
            String bio,
            String displayName,
            String image
    ) throws IOException {
        if(username == null || username.equals("")){
            throw new RuntimeException("Username is empty");
        }
        if(userDao.findById(userId).isPresent()){
            User user = userDao.findById(userId).get();
            user.setId(userId);
            user.setUsername(username);
            user.getProfile().setDisplayName(displayName);
            user.getProfile().setBio(bio);
            if(image != null){
                user.getProfile().setImg(image);
            }
            userDao.save(user);
            return new UpdateUserInfoDto(user.getId(),user.getUsername(),user.getProfile().getDisplayName(),user.getProfile().getImg(),user.getProfile().getBio());
        }
        System.out.println("User not found");
        throw new RuntimeException("User not found");

    }

    public List<UserInfoDto> getUsersNoRelationWithCurrentUser(int userId){
      return   relationsDao.findUsersWithNoRelation(userId)
                .stream()
                .map(u -> toUserInfoDto(u))
                .collect(Collectors.toList());
    }

    public UserInfoDto getUserInfo(int userId) {
        User user = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return toUserInfoDto(user);
    }

    public UserInfoDto getUserInfo(String username){
        var user = userDao.findUserByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
       return toUserInfoDto(user);

    }

    //____________________________________________________________________________________________________//
    public UserInfoDto toUserInfoDto(User user) {
        Profile profile = user.getProfile();
         return new UserInfoDto(
                user.getId(),
                user.getUsername(),
                profile != null ? profile.getDisplayName() : null,
                profile != null ? (profile.getImg() != null ? profile.getImg().toString() : null) : null,
                user.getEmail(),
                profile != null ? profile.getBio() : null,
                countUserFollowing(user.getId()),
                countUserFollowers(user.getId())
        );
    }

    public int countUserFollowers(int userId) {
        return userDao.countFollowersById(userId, RelationType.FOLLOW,RelationType.FOLLOW);
    }
    public  int countUserFollowing(int userId) {
        return userDao.countFollowingByUserId(userId, RelationType.FOLLOW);
    }


    public void printFollowers(int userId) {
        userDao.findById(userId).get().getFollowersList()
                .forEach(follower -> System.out.println(follower));
    }
}
