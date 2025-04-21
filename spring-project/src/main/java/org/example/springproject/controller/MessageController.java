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

}