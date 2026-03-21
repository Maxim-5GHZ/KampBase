// src/main/java/hack/controllers/SkillController.java
package hack.controllers;

import hack.models.Perk;
import hack.models.TreeOfSkills;
import hack.payload.PerkDTO;
import hack.repositories.TreeOfSkillsRepository;
import hack.security.UserDetailsImpl;
import hack.services.PerkManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final TreeOfSkillsRepository treeRepository;
    private final PerkManager perkManager;

    public SkillController(TreeOfSkillsRepository treeRepository, PerkManager perkManager) {
        this.treeRepository = treeRepository;
        this.perkManager = perkManager;
    }

    // Получить всё дерево навыков с отметками "открыто/закрыто"
    @GetMapping("/perks")
    public ResponseEntity<?> getAllPerks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        TreeOfSkills tree = treeRepository.findById(userDetails.id()).orElse(null);
        Set<String> unlocked = (tree != null && tree.getUnlockedPerks() != null) ? tree.getUnlockedPerks() : Set.of();

        List<PerkDTO> response = perkManager.PERKS.stream()
                .map(perk -> PerkDTO.fromPerk(perk, unlocked.contains(perk.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Прокачать (открыть) перк
    @PostMapping("/perks/{perkId}/unlock")
    public ResponseEntity<?> unlockPerk(@PathVariable String perkId, 
                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Perk perk = perkManager.getPerkById(perkId);
        if (perk == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Перк не найден"));
        }

        TreeOfSkills tree = treeRepository.findById(userDetails.id())
                .orElseThrow(() -> new RuntimeException("Дерево навыков не найдено"));

        Set<String> unlocked = tree.getUnlockedPerks();

        // Проверка: уже открыт?
        if (unlocked.contains(perkId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Этот навык уже открыт"));
        }

        // Проверка зависимостей (родителей)
        for (String parentId : perk.getParentIds()) {
            if (!unlocked.contains(parentId)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Сначала необходимо открыть родительский навык: " + parentId
                ));
            }
        }

        // Открываем навык!
        unlocked.add(perkId);
        treeRepository.save(tree);

        return ResponseEntity.ok(Map.of("message", "Навык '" + perk.getName() + "' успешно открыт!"));
    }

    // ДОБАВЛЕНО: Получить статистику (опыт, навыки, перки) любого пользователя по ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSkills(@PathVariable Long userId, 
                                           @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        TreeOfSkills tree = treeRepository.findById(userId)
                .orElseGet(() -> {
                    // Если дерева вдруг нет, возвращаем пустое, чтобы фронт не падал с 404
                    TreeOfSkills emptyTree = new TreeOfSkills();
                    emptyTree.setUserId(userId);
                    emptyTree.setRate(0);
                    emptyTree.setSkills(new HashMap<>());
                    emptyTree.setUnlockedPerks(new HashSet<>());
                    return emptyTree;
                });

        return ResponseEntity.ok(tree);
    }
}