package org.example.springproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.springproject.ds.ChatListDto;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.service.MessageService;
import org.example.springproject.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public void send(@Payload CreateMessageDto messageDto,
                     SimpMessageHeaderAccessor headerAccessor) {
       // String usernamep = SecurityContextHolder.getContext().getAuthentication().getName();
        String username = headerAccessor.getUser().getName();
        int userId = userService.getUserId(username);
        //this is websocket and it will not work here baby..



        System.out.println(messageDto.getContent());
        //var senderId = Integer.parseInt(userId);

        MessageDto savedMessage = messageService.createMessage( messageDto,(userId));

        String receiverName = userService.getUsername(messageDto.getReceiverId());

        System.out.println("Principal name = " +headerAccessor.getUser().getName() );
        System.out.println("username" + username);
      //  System.out.println("usernamep" + usernamep);
        System.out.println("Receiver = " + receiverName);
        try{
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/messages",
                    savedMessage
            );
            messagingTemplate.convertAndSendToUser(
                    receiverName,
                    "/queue/messages",
                    savedMessage
            );
        }catch (Exception e){
            e.printStackTrace();

        }



    }


    @GetMapping("/get-conversation/{otherUserId}")
    public ResponseEntity<List<MessageDto>> getConversation(
            @RequestHeader("X-User-Id")String userId,
            @PathVariable String otherUserId) {
        List<MessageDto> messages = messageService.getMessagesByUser(Integer.parseInt(userId),Integer.parseInt(otherUserId));
        return ResponseEntity.ok(messages);
    }
}
