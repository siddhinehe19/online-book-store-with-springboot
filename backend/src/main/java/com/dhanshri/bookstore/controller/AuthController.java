package com.dhanshri.bookstore.controller;

import com.dhanshri.bookstore.dto.AuthRequest;
import com.dhanshri.bookstore.dto.RegisterRequest;
import com.dhanshri.bookstore.model.User;
import com.dhanshri.bookstore.repository.UserRepository;
import com.dhanshri.bookstore.security.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(
            UserRepository users,
            PasswordEncoder encoder,
            JwtService jwt) {

        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        // Check whether email already exists
        if (users.existsByEmail(email)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "An account with this email already exists."
                    ));
        }

        // Create new User
        User user = new User();

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(
                encoder.encode(request.password())
        );
        user.setRole("USER");

        // Save user to database
        users.save(user);

        // Generate JWT token
        String token = jwt.generate(user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", Map.of(
                                "id", user.getId(),
                                "name", user.getName(),
                                "email", user.getEmail()
                        )
                )
        );
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody AuthRequest request) {

        String email = request.email().trim().toLowerCase();

        return users.findByEmail(email)

                .filter(user ->
                        encoder.matches(
                                request.password(),
                                user.getPassword()
                        )
                )

                .<ResponseEntity<?>>map(user -> {

                    String token = jwt.generate(user.getEmail());

                    return ResponseEntity.ok(
                            Map.of(
                                    "token", token,
                                    "user", Map.of(
                                            "id", user.getId(),
                                            "name", user.getName(),
                                            "email", user.getEmail()
                                    )
                            )
                    );
                })

                .orElseGet(() ->
                        ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(
                                        Map.of(
                                                "message",
                                                "Invalid email or password."
                                        )
                                )
                );
    }
}