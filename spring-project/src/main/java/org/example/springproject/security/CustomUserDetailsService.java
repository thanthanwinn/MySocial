package org.example.springproject.security;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.UserDao;
import org.example.springproject.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService  implements UserDetailsService {

    private final UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("in userdetails service");
        User user = userDao.findUserByUsername(username).get();
        var newUser =  new CustomUserDetails();
        newUser.setUser(user);
        return newUser;

    }



}
