package org.example.springproject.config; // Or a more suitable package

import org.example.springproject.jwt.JwtTokenProvider; // Your JWT provider
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

// Mark as @Component so Spring can inject it
@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public WebSocketAuthChannelInterceptor(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Only process CONNECT commands
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Get the Authorization header from the STOMP CONNECT frame's native headers
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7); // Extract the token
                try {
                    // Validate JWT and load user details
                    String username = jwtTokenProvider.getUserNameFromToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    if (jwtTokenProvider.validateToken(jwt)) { // Assuming validateToken takes just the token
                        // Create and set the Authentication object
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        accessor.setUser(authentication);
                        SecurityContextHolder.getContext().setAuthentication(authentication);// THIS IS THE KEY LINE
                        System.out.println("STOMP CONNECT: User " + username + " authenticated." + authentication.getName());
                    } else {
                        // Token invalid (expired, bad signature, etc.)
                        System.err.println("STOMP CONNECT: Invalid JWT token provided.");
                        // Important: If authentication fails, you might want to throw an exception
                        // to prevent the connection, e.g., throw new MessageDeliveryException("Unauthorized");
                        // Or let it proceed as anonymous, but for private messaging, denial is better.
                    }
                } catch (Exception e) {
                    System.err.println("STOMP CONNECT: Error processing JWT: " + e.getMessage());
                    // Deny connection on error
                    // throw new MessageDeliveryException("Authentication error: " + e.getMessage());
                }
            } else {
                System.err.println("STOMP CONNECT: No valid Authorization header found or malformed.");
                // Deny connection if no token or malformed header
                // throw new MessageDeliveryException("Authentication required.");
            }
        }
        return message; // Allow the message to proceed
    }
}