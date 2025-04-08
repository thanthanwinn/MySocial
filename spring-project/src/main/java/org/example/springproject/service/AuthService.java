package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.RoleDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.entity.User;
import org.example.springproject.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final RoleDao roleDao;
    private final AuthenticationManager authenticationManager;
    private  final JwtTokenProvider jwtTokenProvider;

     public record LoginResponse(String token,int id){}
    public LoginResponse login(String username, String password) {
       UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
       Authentication authentication = authenticationManager.authenticate(token);
       SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        int userId = userDao.getIdByUsername(userDetails.getUsername());

        StringBuilder sb = new StringBuilder();

        for(var role : authentication.getAuthorities()){
            sb.append(role);

       }
        return  new LoginResponse(jwtTokenProvider.generateToken(authentication),userId) ;
    }
    @Transactional
    public String register(String username, String password,String email) {
        System.out.println("now registering");

        User registerUser = new User();
        registerUser.setUsername(username);
        registerUser.setPassword(passwordEncoder.encode(password));
        registerUser.setEmail(email);
        userDao.save(registerUser);
        return "Register success " + registerUser.getUsername();
    }
}
