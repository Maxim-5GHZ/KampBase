// src/main/java/hack/services/PerkManager.java
package hack.services;

import hack.models.Perk;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PerkManager {

    // Жестко заданное дерево навыков
    public final List<Perk> PERKS = List.of(
        new Perk("java-basics", "Основы Java", "J", "Открывает доступ к задачам по Java", List.of()),
        new Perk("java-exp", "Java: Опыт", "JE", "Даёт +10% к опыту за выполнение задач по Java", List.of("java-basics")),
        new Perk("java-rep", "Java: Репутация", "JR", "Даёт +10% к звёздам репутации", List.of("java-exp")),
        
        new Perk("python-basics", "Основы Python", "P", "Открывает доступ к задачам по Python", List.of()),
        new Perk("python-exp", "Python: Опыт", "PE", "Даёт +10% к опыту за выполнение задач по Python", List.of("python-basics")),
        new Perk("python-rep", "Python: Репутация", "PR", "Даёт +10% к звёздам репутации", List.of("python-exp")),
        
        new Perk("js-basics", "Основы JavaScript", "JS", "Открывает доступ к задачам по JavaScript", List.of()),
        new Perk("js-exp", "JavaScript: Опыт", "JSE", "Даёт +10% к опыту за выполнение задач по JavaScript", List.of("js-basics")),
        new Perk("js-rep", "JavaScript: Репутация", "JSR", "Даёт +10% к звёздам репутации", List.of("js-exp")),
        
        new Perk("sql-basics", "Основы SQL", "SQL", "Открывает доступ к задачам по SQL", List.of()),
        new Perk("sql-exp", "SQL: Опыт", "SQLE", "Даёт +10% к опыту за выполнение задач по SQL", List.of("sql-basics")),
        new Perk("sql-rep", "SQL: Репутация", "SQLR", "Даёт +10% к звёздам репутации", List.of("sql-exp")),
        
        new Perk("db-design", "Проектирование БД", "DBD", "Открывает доступ к задачам по проектированию баз данных", List.of("sql-basics")),
        new Perk("db-master", "Мастер БД", "DBM", "Даёт +15% к опыту за задачи по проектированию БД", List.of("db-design"))
    );

    public Perk getPerkById(String id) {
        return PERKS.stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null);
    }

    // Механика 1: Какой перк нужен, чтобы вообще решать задачу?
    public String getRequiredBasePerk(String taskSkillName) {
        if (taskSkillName == null) return null;
        return switch (taskSkillName.toLowerCase().trim()) {
            case "java" -> "java-basics";
            case "python" -> "python-basics";
            case "javascript", "js" -> "js-basics";
            case "sql" -> "sql-basics";
            case "db design", "проектирование бд" -> "db-design";
            default -> null; // Для неизвестных навыков ограничений нет
        };
    }

    // Механика 2: Расчет бонуса к опыту
    public double getExpMultiplier(String taskSkillName, Set<String> unlockedPerks) {
        if (taskSkillName == null) return 1.0;
        double multiplier = 1.0;
        String skill = taskSkillName.toLowerCase().trim();

        if (skill.equals("java") && unlockedPerks.contains("java-exp")) multiplier += 0.10;
        if (skill.equals("python") && unlockedPerks.contains("python-exp")) multiplier += 0.10;
        if ((skill.equals("javascript") || skill.equals("js")) && unlockedPerks.contains("js-exp")) multiplier += 0.10;
        if (skill.equals("sql") && unlockedPerks.contains("sql-exp")) multiplier += 0.10;
        if ((skill.equals("db design") || skill.equals("проектирование бд")) && unlockedPerks.contains("db-master")) multiplier += 0.15;

        return multiplier;
    }
}