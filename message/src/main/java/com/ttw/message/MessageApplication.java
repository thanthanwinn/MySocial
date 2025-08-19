package com.ttw.message;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.LinkedHashMap;

@SpringBootApplication
public class MessageApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessageApplication.class, args);
    }
    @Bean
    public ApplicationRunner runner() {
        return args -> {
            Thread tr = new Thread(() -> {
                for (int i = 0; i <= 10; i++) {
                    System.out.println(i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
            tr.start();
            Thread tr2 = new Thread(tr);
            tr2.start();
        };
    }


}
