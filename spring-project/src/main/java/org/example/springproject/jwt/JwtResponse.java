package org.example.springproject.jwt;

import org.springframework.stereotype.Component;


public class JwtResponse {
    private String token;

    // Constructor
    public JwtResponse(String token) {
        this.token = token;
    }

    // Getter
    public String getToken() {
        return token;
    }
}
