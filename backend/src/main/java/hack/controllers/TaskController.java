// hack/controllers/TaskController.java
package hack.controllers;

import hack.enums.Role;
import hack.enums.SolutionStatus;
import hack.models.CompleteTask;
import hack.models.Task;
import hack.models.TreeOfSkills;
import hack.models.User;
import hack.payload.ReviewSolutionRequest;
import hack.payload.SubmitSolutionRequest;
import hack.payload.TaskRequest;
import hack.repositories.CompleteTaskRepository;
import hack.repositories.TaskRepository;
import hack.repositories.TreeOfSkillsRepository;
import hack.repositories.UserRepository;
import hack.security.UserDetailsImpl;
import hack.services.PerkManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final CompleteTaskRepository completeTaskRepository;
    private final UserRepository userRepository;
    private final TreeOfSkillsRepository treeOfSkillsRepository;
    private final PerkManager perkManager;

    public TaskController(TaskRepository taskRepository, 
                          CompleteTaskRepository completeTaskRepository, 
                          UserRepository userRepository,
                          TreeOfSkillsRepository treeOfSkillsRepository,
                          PerkManager perkManager) {
        this.taskRepository = taskRepository;
        this.completeTaskRepository = completeTaskRepository;
        this.userRepository = userRepository;
        this.treeOfSkillsRepository = treeOfSkillsRepository;
        this.perkManager = perkManager;
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest request, 
                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userRepository.findById(userDetails.id()).orElseThrow();
        if (user.getRole() != Role.MENTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Только ментор может создавать таски"));
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setAbout(request.getAbout());
        task.setGithubLink(request.getGithubLink());
        task.setSkillName(request.getSkillName()); 
        task.setAuthor(user);
        task.setIsActive(true);

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllActiveTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping("/{taskId}/submit")
    public ResponseEntity<?> submitSolution(@PathVariable Long taskId, 
                                            @RequestBody SubmitSolutionRequest request,
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User student = userRepository.findById(userDetails.id()).orElseThrow();
        if (student.getRole() != Role.STUDENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Только студент может отправлять решения"));
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Таска не найдена"));

        // МЕХАНИКА 1: Проверка наличия базового перка
        String requiredPerk = perkManager.getRequiredBasePerk(task.getSkillName());
        if (requiredPerk != null) {
            TreeOfSkills tree = treeOfSkillsRepository.findById(student.getUserId()).orElse(null);
            if (tree == null || tree.getUnlockedPerks() == null || !tree.getUnlockedPerks().contains(requiredPerk)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "У вас не открыт базовый навык для этой задачи! Требуется открыть перк: " + requiredPerk
                ));
            }
        }

        CompleteTask solution = new CompleteTask();
        solution.setTask(task);
        solution.setUser(student);
        solution.setCommitHash(request.getCommitHash());
        solution.setStatus(SolutionStatus.PENDING);

        return ResponseEntity.ok(completeTaskRepository.save(solution));
    }

   @Transactional
    @PostMapping("/solutions/{solutionId}/review")
    public ResponseEntity<?> reviewSolution(@PathVariable Long solutionId, 
                                            @RequestBody ReviewSolutionRequest request,
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User mentor = userRepository.findById(userDetails.id()).orElseThrow();
        if (mentor.getRole() != Role.MENTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Только ментор может проверять решения"));
        }

        CompleteTask solution = completeTaskRepository.findById(solutionId)
                .orElseThrow(() -> new RuntimeException("Решение не найдено"));

        if (solution.getStatus() != SolutionStatus.PENDING) {
            return ResponseEntity.badRequest().body(Map.of("message", "Решение уже проверено"));
        }

        if (request.isApproved()) {
            solution.setStatus(SolutionStatus.APPROVED);

            TreeOfSkills tree = treeOfSkillsRepository.findById(solution.getUser().getUserId()).orElseThrow();
            String targetSkill = solution.getTask().getSkillName();

            // МЕХАНИКА 2: Применяем бонусный множитель за прокачанные перки
            double multiplier = perkManager.getExpMultiplier(targetSkill, tree.getUnlockedPerks());
            int finalRating = (int) Math.round(request.getRating() * multiplier);

            solution.setReceivedRating(finalRating); // Сохраняем финальный (увеличенный) рейтинг
            
            // 1. Увеличиваем общий рейтинг
            tree.setRate(tree.getRate() + finalRating);

            // 2. Распределяем по веткам
            if (targetSkill != null && !targetSkill.trim().isEmpty()) {
                Map<String, Integer> currentSkills = tree.getSkills();
                if (currentSkills == null) currentSkills = new HashMap<>();
                
                int currentSkillPoints = currentSkills.getOrDefault(targetSkill, 0);
                currentSkills.put(targetSkill, currentSkillPoints + finalRating);
                
                tree.setSkills(new HashMap<>(currentSkills));
            }

            treeOfSkillsRepository.save(tree);
        } else {
            solution.setStatus(SolutionStatus.REJECTED);
            solution.setReceivedRating(0);
        }

        return ResponseEntity.ok(completeTaskRepository.save(solution));
    }

    @GetMapping("/skills/my")
    public ResponseEntity<?> getMySkills(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        TreeOfSkills tree = treeOfSkillsRepository.findById(userDetails.id())
                .orElseGet(() -> {
                    TreeOfSkills emptyTree = new TreeOfSkills();
                    emptyTree.setUserId(userDetails.id());
                    emptyTree.setRate(0);
                    emptyTree.setSkills(new HashMap<>());
                    return emptyTree;
                });
        return ResponseEntity.ok(tree);
    }
    @GetMapping("/{taskId}/solutions")
public ResponseEntity<?> getSolutionsByTask(@PathVariable Long taskId, 
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    // Можно добавить проверку, что это запрашивает именно автор задачи (ментор)
    List<CompleteTask> solutions = completeTaskRepository.findByTaskId(taskId);
    return ResponseEntity.ok(solutions);
}
}