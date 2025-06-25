package org.example.springproject.aspect;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.entity.Notification;
import org.example.springproject.service.MessageService;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class MessageAspect {
    private final MessageService messageService;
    private final UserDao userDao;

   // @After(value = "execution(* org.example.springproject.service.MessageService.createMessage(..)) && args(createMessageDto)")
    public void sendMessage(CreateMessageDto createMessageDto, int senderId) {
        messageService.createMessage(createMessageDto,senderId);

    }
      @After(value = "execution(* org.example.springproject.service.MessageService.getMessageByUser(..)) && args(id)")
    public void getMessages(int id) {
      //  messageService.getMessageByUser(id);
    }
}
