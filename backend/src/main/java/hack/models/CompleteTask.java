package hack.models;

import hack.enums.SolutionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complete_task")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CompleteTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "solution_id")
    private Long solutionId;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "commit_hash") // Заменили pullRequestLink на commitHash
    private String commitHash;

    @Enumerated(EnumType.STRING)
    private SolutionStatus status = SolutionStatus.PENDING;
    
    private Integer receivedRating; // Сколько баллов получил студент за это решение
}