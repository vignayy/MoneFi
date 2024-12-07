//package com.example.apigateway.controller;
//
//
//import com.example.apigateway.service.ResetPasswordService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@CrossOrigin("http://localhost:4200")
//public class ResetPasswordController {
//    @Autowired
//    private ResetPasswordService passwordResetService;
//
////    @GetMapping("hello")
////    public String hello(){
////        return "Hello";
////    }
//
//    @PostMapping("/auth/forgot-password")
//    public String forgotPassword(@RequestParam String email) {
//        return passwordResetService.forgotPassword(email);
//    }
//
//
//    @PostMapping("/auth/verify-code")
//    public String verifyCode(@RequestParam String email, @RequestParam String code) {
//        boolean isValid = passwordResetService.verifyCode(email, code);
//        if (isValid) {
//            return "Verification successful!";
//        } else {
//            throw new RuntimeException("Invalid verification code");
////            return "Invalid or expired verification code!";
//        }
//    }
//    @PutMapping("auth/update-password")
//    public String updatePassword(@RequestParam String email,@RequestParam String password)
//    {
//        return passwordResetService.UpdatePassword(email,password);
//    }
//}
