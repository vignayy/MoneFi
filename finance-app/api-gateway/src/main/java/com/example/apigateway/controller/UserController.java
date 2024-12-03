package com.example.apigateway.controller;

import com.example.apigateway.dao.UserRepo;
import com.example.apigateway.dto.JwtToken;
import com.example.apigateway.dto.UserProfile;
import com.example.apigateway.model.User;
import com.example.apigateway.service.JwtService;
import com.example.apigateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    @Autowired
    private UserRepo userRepo;

    @GetMapping("/getUserId/{email}")
    public Integer getUserId(@PathVariable("email") String email){
        User user = userRepo.findByUsername(email);
        return user.getId();
    }
    @PostMapping("/register")
    public JwtToken register(@RequestBody UserProfile userProfile) {
        User user = new User();
        user.setUsername(userProfile.getUsername());
        user.setPassword(userProfile.getPassword());

        User savedUser = userService.saveUser(user);
        return jwtService.generateToken(user.getUsername());
//        return savedUser.getId();

    }

    @PostMapping("/login")
    public JwtToken login(@RequestBody User user) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated()) return jwtService.generateToken(user.getUsername());
        else return null;
    }

    @GetMapping("/token/{token}")
    public Integer getUserIdFromToken(@PathVariable("token") String token){
        String username = jwtService.extractUserName(token);
        return userRepo.findByUsername(username).getId();
    }
}
