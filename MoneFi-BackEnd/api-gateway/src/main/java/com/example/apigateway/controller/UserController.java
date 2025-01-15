package com.example.apigateway.controller;

import com.example.apigateway.dao.UserRepo;
import com.example.apigateway.dto.JwtToken;
import com.example.apigateway.dto.UserProfile;
import com.example.apigateway.model.User;
import com.example.apigateway.service.JwtService;
import com.example.apigateway.service.ResetPasswordService;
import com.example.apigateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
    public ResponseEntity<?> register(@RequestBody UserProfile userProfile) {
        User user = new User();
        user.setUsername(userProfile.getUsername());
        user.setPassword(userProfile.getPassword());

        User getUser = userRepo.findByUsername(user.getUsername());
        if (getUser != null) {
            // Return a conflict status code with a custom message when user already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        // If user doesn't exist, proceed with saving the user
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(jwtService.generateToken(user.getUsername()));
    }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {
    try {
        // Validate user input (username and password should not be empty)
        if (user.getUsername() == null || user.getUsername().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Check if the user exists in the database
        User existingUser = userRepo.findByUsername(user.getUsername());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found. Please sign up.");
        }

        try {
            // Authenticate the user with the provided password
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            // If authentication is successful
            if (authentication.isAuthenticated()) {
                JwtToken token = jwtService.generateToken(user.getUsername());
                return ResponseEntity.ok(token);
            }
        } catch (BadCredentialsException ex) {
            // If the password is incorrect
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }

        // Default case for any other authentication failures
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    } catch (Exception e) {
        // Handle any unexpected errors
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
    }
}


    @GetMapping("/token/{token}")
    public Integer getUserIdFromToken(@PathVariable("token") String token){
        String username = jwtService.extractUserName(token);
        return userRepo.findByUsername(username).getId();
    }





    // api calls for forgot password
    @Autowired
    private ResetPasswordService passwordResetService;

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return passwordResetService.forgotPassword(email);
    }
    @PostMapping("/verify-code")
    public String verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isValid = passwordResetService.verifyCode(email, code);
        if (isValid) {
            return "Verification successful!";
        } else {
            throw new RuntimeException("Invalid verification code");
        }
    }
    @PutMapping("/update-password")
    public String updatePassword(@RequestParam String email,@RequestParam String password)
    {
        return passwordResetService.UpdatePassword(email,password);
    }
}
