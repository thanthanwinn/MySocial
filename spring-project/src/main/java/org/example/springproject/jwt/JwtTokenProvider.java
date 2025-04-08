package org.example.springproject.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    //generate jwt Token
    //validate jwt Token
    //get username from jwt token
    @Value("${jwt.secret}")
    private String jwtSecret;
    private long jwtExpirationMs = 86400000;

    public String getUserNameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(keys())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        Jwts.parser()
                .verifyWith(keys())
                .build()
                .parse(token);
        return true;
    }

    public  String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + jwtExpirationMs);
        String token = Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(expirationDate)
                .signWith(keys())
                .compact();
        return token;

    }

    private SecretKey keys() {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));

    }
}
