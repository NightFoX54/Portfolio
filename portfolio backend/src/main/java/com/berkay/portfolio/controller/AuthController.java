package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.berkay.portfolio.model.Admin;
import com.berkay.portfolio.repository.AdminRepository;
import com.berkay.portfolio.service.JwtService;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails.getUsername());
            
            System.out.println("Login successful for user: " + userDetails.getUsername());
            System.out.println("Generated token: " + token.substring(0, Math.min(50, token.length())) + "...");

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Optional<Admin> adminOpt = adminRepository.findByUsername(request.getUsername());
            if (!adminOpt.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Admin not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Admin admin = adminOpt.get();
            // In a real application, you should verify the old password
            admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
            adminRepository.save(admin);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to change password");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/change-username")
    public ResponseEntity<Map<String, String>> changeUsername(@RequestBody ChangeUsernameRequest request) {
        try {
            Optional<Admin> adminOpt = adminRepository.findByUsername(request.getOldUsername());
            if (!adminOpt.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Admin not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Check if new username already exists
            if (adminRepository.existsByUsername(request.getNewUsername())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Admin admin = adminOpt.get();
            admin.setUsername(request.getNewUsername());
            adminRepository.save(admin);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Username changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to change username");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Inner classes for request bodies
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ChangePasswordRequest {
        private String username;
        private String newPassword;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class ChangeUsernameRequest {
        private String oldUsername;
        private String newUsername;

        public String getOldUsername() { return oldUsername; }
        public void setOldUsername(String oldUsername) { this.oldUsername = oldUsername; }
        public String getNewUsername() { return newUsername; }
        public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
    }
}
