package org.example.springproject.service;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.MessageDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.ds.CreateMessageDto;
import org.example.springproject.ds.MessageDto;
import org.example.springproject.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

}