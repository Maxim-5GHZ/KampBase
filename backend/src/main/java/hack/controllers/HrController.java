// src/main/java/hack/controllers/HrController.java
package hack.controllers;

import hack.enums.Role;
import hack.models.HrFavorite;
import hack.models.TreeOfSkills;
import hack.models.User;
import hack.payload.LeaderboardResponse;
import hack.payload.UserShortInfoResponse;
import hack.repositories.HrFavoriteRepository;
import hack.repositories.TreeOfSkillsRepository;
import hack.repositories.UserRepository;
import hack.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    private final UserRepository userRepository;
    private final TreeOfSkillsRepository treeOfSkillsRepository;
    private final HrFavoriteRepository hrFavoriteRepository;

    public HrController(UserRepository userRepository, 
                        TreeOfSkillsRepository treeOfSkillsRepository, 
                        HrFavoriteRepository hrFavoriteRepository) {
        this.userRepository = userRepository;
        this.treeOfSkillsRepository = treeOfSkillsRepository;
        this.hrFavoriteRepository = hrFavoriteRepository;
    }

    // ИСПРАВЛЕНИЕ: Тотально переписан на Java Streams для железобетонной работы
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(required = false) String skill) {
        List<TreeOfSkills> allTrees = treeOfSkillsRepository.findAll();
        List<TreeOfSkills> filteredTrees;

        // ИСПРАВЛЕНИЕ: Оставляем только студентов
        List<TreeOfSkills> studentTrees = allTrees.stream()
                .filter(t -> t.getUser() != null && t.getUser().getRole() == Role.STUDENT)
                .collect(Collectors.toList());

        if (skill != null && !skill.trim().isEmpty()) {
            filteredTrees = studentTrees.stream()
                    .filter(t -> t.getSkills() != null && t.getSkills().containsKey(skill))
                    .sorted((t1, t2) -> t2.getSkills().get(skill).compareTo(t1.getSkills().get(skill)))
                    .collect(Collectors.toList());
        } else {
            filteredTrees = studentTrees.stream()
                    .sorted((t1, t2) -> Integer.compare(
                            t2.getRate() != null ? t2.getRate() : 0, 
                            t1.getRate() != null ? t1.getRate() : 0))
                    .collect(Collectors.toList());
        }

        List<LeaderboardResponse> response = filteredTrees.stream().map(tree -> {
            Integer skillPoints = null;
            if (skill != null && !skill.trim().isEmpty() && tree.getSkills() != null) {
                skillPoints = tree.getSkills().getOrDefault(skill, 0);
            }
            
            return new LeaderboardResponse(
                    tree.getUser().getUserId(),
                    tree.getUser().getUsername(),
                    tree.getUser().getName(),
                    tree.getUser().getLastName(),
                    tree.getRate() != null ? tree.getRate() : 0,
                    skillPoints
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/favorites/{studentId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long studentId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!isRole(userDetails, Role.HR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Доступ только для HR"));
        }

        User hr = userRepository.findById(userDetails.id()).orElseThrow();
        User student = userRepository.findById(studentId).orElse(null);

        if (student == null || student.getRole() != Role.STUDENT) {
            return ResponseEntity.badRequest().body(Map.of("message", "Студент не найден"));
        }

        if (hrFavoriteRepository.findByHrUserIdAndStudentUserId(hr.getUserId(), student.getUserId()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Студент уже в избранном"));
        }

        HrFavorite favorite = new HrFavorite();
        favorite.setHr(hr);
        favorite.setStudent(student);
        hrFavoriteRepository.save(favorite);

        return ResponseEntity.ok(Map.of("message", "Студент добавлен в избранное"));
    }

    @DeleteMapping("/favorites/{studentId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long studentId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!isRole(userDetails, Role.HR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Доступ только для HR"));
        }

        Optional<HrFavorite> favorite = hrFavoriteRepository.findByHrUserIdAndStudentUserId(userDetails.id(), studentId);
        if (favorite.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Студент не найден в избранном"));
        }

        hrFavoriteRepository.delete(favorite.get());
        return ResponseEntity.ok(Map.of("message", "Студент удален из избранного"));
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!isRole(userDetails, Role.HR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Доступ только для HR"));
        }

        List<HrFavorite> favorites = hrFavoriteRepository.findByHrUserId(userDetails.id());
        List<UserShortInfoResponse> response = favorites.stream()
                .map(fav -> UserShortInfoResponse.fromUser(fav.getStudent()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private boolean isRole(UserDetailsImpl userDetails, Role role) {
        if (userDetails == null) return false;
        User user = userRepository.findById(userDetails.id()).orElse(null);
        return user != null && user.getRole() == role;
    }
}