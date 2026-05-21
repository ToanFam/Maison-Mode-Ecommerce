package com.maisonmode.service;

import com.maisonmode.dto.AuthResponse;
import com.maisonmode.dto.LoginRequest;
import com.maisonmode.dto.RegisterRequest;
import com.maisonmode.dto.UserResponse;
import com.maisonmode.entity.Role;
import com.maisonmode.entity.User;
import com.maisonmode.exception.ConflictException;
import com.maisonmode.repository.UserRepository;
import com.maisonmode.security.JwtService;
import com.maisonmode.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        log.info("Registering user email={}", normalizedEmail);

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            log.info("Registration rejected because email already exists email={}", normalizedEmail);
            throw new ConflictException("Email already exists");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new UserPrincipal(savedUser));
        log.info("Registration completed userId={} email={}", savedUser.getId(), savedUser.getEmail());
        return new AuthResponse(token, UserResponse.from(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizeEmail(request.email()), request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, UserResponse.from(user));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
