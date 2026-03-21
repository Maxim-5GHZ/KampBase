package hack.models;

import jakarta.persistence.*;
import lombok.*;
import hack.enums.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Рекомендуется автогенерация
    @Column(name = "user_id")
    private Long userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // Здесь будет храниться BCrypt хеш

    private String name;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String company;

    @Column(name = "photo_link")
    private String photoLink;

    @Column(name = "github_user_name")
    private String githubUserName;
}