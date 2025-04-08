package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<MessageDto> sendMessage(
            @RequestHeader("X-User-Id") int senderId,
            @PathVariable int receiverId,
            @RequestBody CreateMessageDto messageDto) {
        MessageDto message = messageService.sendMessage(senderId, receiverId, messageDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getConversation(
            @RequestHeader("X-User-Id") int userId,
            @PathVariable int otherUserId) {
        List<MessageDto> messages = messageService.getConversation(userId, otherUserId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<MessageDto>> getInbox(
            @RequestHeader("X-User-Id") int userId) {
        List<MessageDto> inbox = messageService.getInbox(userId);
        return ResponseEntity.ok(inbox);
    }
}