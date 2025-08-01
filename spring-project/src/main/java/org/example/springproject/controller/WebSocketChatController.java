package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.service.MessageService;
import org.example.springproject.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class WebSocketChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @MessageMapping("/send-message")
    public void sendMessage(@Payload CreateMessageDto createMessageDto, Principal principal) {
        String senderUsername = principal.getName();
        int senderId = userService.getUserId(senderUsername);

        System.out.println("Message from " + senderUsername + ": " + createMessageDto.getContent());

        try {
            // Save the message to the database
            MessageDto savedMessage = MessageDto.fromMessage(
                    messageService.createMessage(createMessageDto, senderId)
            );

            String receiverUsername = userService.getUsername(createMessageDto.getReceiverId());

            System.out.println("Sender: " + senderUsername + ", Receiver: " + receiverUsername);

            // Send the message to the sender
            messagingTemplate.convertAndSendToUser(
                    senderUsername,
                    "/queue/messages",
                    savedMessage
            );
            // Send the message to the receiver
            messagingTemplate.convertAndSendToUser(
                    receiverUsername,
                    "/queue/messages",
                    savedMessage
            );
        } catch (Exception e) {
            System.err.println("Failed to send message via WebSocket: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping("/get-conversation/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getConversation(
            Principal principal,
            @PathVariable String otherUserId) {
        int currentUserId = userService.getUserId(principal.getName());
        List<MessageDto> messages = messageService.getMessagesByUser(currentUserId, Integer.parseInt(otherUserId));
        return ResponseEntity.ok(messages);
    }
}
