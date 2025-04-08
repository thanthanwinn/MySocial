package org.example.springproject.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.springproject.service.AuthService;
import org.example.springproject.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    record LoginUserDto(String username,String password){}
    record RegisterUserDto(String username,String password,String email){}
    @GetMapping("/")
    public String test(){
        return "just testing";
    }
    @PostMapping("/login")
    public ResponseEntity<AuthService.LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {

        System.out.println("in login method");
        System.out.println("Username" + loginUserDto.username);
        System.out.println("Password" + loginUserDto.password);

         return ResponseEntity.ok(authService.login(loginUserDto.username,loginUserDto.password));

    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterUserDto registerUserDto) {
        System.out.println("Username" + registerUserDto.username);
        System.out.println("Password" + registerUserDto.password);
        System.out.println("mehthod registering in controller");
        authService.register(registerUserDto.username,registerUserDto.password,registerUserDto.email);
        return ResponseEntity.ok("register success");
    }
}
