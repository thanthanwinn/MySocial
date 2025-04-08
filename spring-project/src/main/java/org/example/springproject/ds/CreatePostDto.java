package org.example.springproject.ds;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.springproject.entity.Visibility;

@Data
public class CreatePostDto {
    @NotBlank
    private String content;
    private Visibility visibility = Visibility.PUBLIC; // Default to PUBLIC
}