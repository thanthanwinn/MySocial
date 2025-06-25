package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class WebSocketChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send-message")
    public void send(@Payload CreateMessageDto messageDto,
                     SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("X-User-Id");
        System.out.println(messageDto.getContent());
        //var senderId = Integer.parseInt(userId);

        MessageDto savedMessage = messageService.createMessage( messageDto,Integer.parseInt(userId));

        // Send to receiver ONLY
        messagingTemplate.convertAndSendToUser(
                String.valueOf(messageDto.getReceiverId()), // /user/{id}/...
                "/queue/messages",
                savedMessage
        );

        // Optionally send to sender too (if you want echo)
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId
                ),
                "/queue/messages",
                savedMessage
        );
    }
}
