// src/main/java/hack/controllers/AuthController.java
package hack.controllers;

import hack.enums.Role;
import hack.models.*;
import hack.payload.*;
import hack.repositories.*;
import hack.security.JwtUtils;
import hack.security.UserDetailsImpl;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TreeOfSkillsRepository treeOfSkillsRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          TreeOfSkillsRepository treeOfSkillsRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.treeOfSkillsRepository = treeOfSkillsRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication.getName());

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // ДОБАВЛЕНО: Достаем пользователя из БД для получения имени и фамилии
            User user = userRepository.findById(userDetails.id())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            return ResponseEntity.ok(new JwtResponse(
                    jwt, 
                    userDetails.id(), 
                    userDetails.getUsername(), 
                    user.getName(), 
                    user.getLastName(), 
                    roles
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ошибка: Неверный логин или пароль");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Ошибка: Пользователь уже существует!");
        }

        // Создаем пользователя
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setLastName(signUpRequest.getLastName());
        user.setRole(signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.STUDENT);

        User savedUser = userRepository.save(user);

        // Сразу создаем ему пустое дерево скиллов
        TreeOfSkills tree = TreeOfSkills.builder()
                .user(savedUser)
                .rate(0)
                .skills(new HashMap<>())
                .build();
        treeOfSkillsRepository.save(tree);

        return ResponseEntity.ok("Пользователь успешно зарегистрирован!");
    }
}