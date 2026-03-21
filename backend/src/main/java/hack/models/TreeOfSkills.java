// hack/models/TreeOfSkills.java
package hack.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashMap;
import java.util.Map;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tree_of_skills")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TreeOfSkills {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Builder.Default
    private Integer rate = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_data", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "skill_name")
    @Column(name = "skill_value")
    @Builder.Default
    private Map<String, Integer> skills = new HashMap<>();

    // ДОБАВЛЕНО: Список ID перков, которые открыл пользователь
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_unlocked_perks", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "perk_id")
    @Builder.Default
    private Set<String> unlockedPerks = new HashSet<>();
}