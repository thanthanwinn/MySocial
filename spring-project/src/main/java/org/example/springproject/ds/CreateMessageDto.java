package org.example.springproject.ds;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateMessageDto {
    @NotBlank
    private String content;
    @NotBlank
    private int receiverId;
}