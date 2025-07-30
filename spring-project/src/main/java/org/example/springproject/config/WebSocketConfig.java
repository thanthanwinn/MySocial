package org.example.springproject.config;

import lombok.RequiredArgsConstructor;
import org.example.springproject.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;


@Configuration
@EnableScheduling
@ComponentScan
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor;
    public WebSocketConfig(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService,WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.webSocketAuthChannelInterceptor = webSocketAuthChannelInterceptor;
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
               // .setAllowedOrigins("*")
                .setAllowedOriginPatterns("*")
                .withSockJS();

    }
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Register the interceptor to process incoming client messages (like CONNECT)
        registration.interceptors(webSocketAuthChannelInterceptor);
    }



    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic","/user");
        registry.setApplicationDestinationPrefixes("/backend");
        registry.setUserDestinationPrefix("/user/queue/messages");
    }


}
