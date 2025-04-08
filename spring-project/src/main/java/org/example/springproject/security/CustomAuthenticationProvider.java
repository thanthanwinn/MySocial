package org.example.springproject.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        System.out.println("in auth provider");

        System.out.println("Authentication object: " + authentication);
        System.out.println("Principal: " + authentication.getPrincipal());
        System.out.println("Credentials: " + authentication.getCredentials());
        String username = authentication.getName();
        System.out.println("username: " + username);
        String password = String.valueOf(authentication.getCredentials());
        UserDetails user ;
        try {
            user = userDetailsService.loadUserByUsername(username);
            System.out.println("Raw password from request: " + password);
            System.out.println("Encoded password from DB: " + user.getPassword());
        } catch (Exception e) {
            System.out.println("ERROR in loadUserByUsername: " + e.getMessage());
            throw e;
        }


        if (passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("matching password");
            return new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    user.getAuthorities()
            );
        }
        throw new BadCredentialsException("Bad credentials");


    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
