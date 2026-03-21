package hack.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "hr_favorites",
    uniqueConstraints = @UniqueConstraint(columnNames = {"hr_id", "student_id"})
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class HrFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hr_id", nullable = false)
    private User hr;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
}