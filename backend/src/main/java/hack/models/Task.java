// hack/models/Task.java
package hack.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long id;

    private String title; 

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author; 

    @Column(name = "githublink")
    private String githubLink;

    private String about;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // ДОБАВЛЕНО: Какой навык прокачивает эта таска (например, "Python", "Java", "SQL")
    @Column(name = "skill_name")
    private String skillName;
}