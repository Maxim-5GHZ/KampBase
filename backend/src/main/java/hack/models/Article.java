package hack.models;

import hack.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "articles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Предполагаемый article_id

    private String title;
    private String about;
    private String author;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "star_count")
    private Long starCount;

    @Enumerated(EnumType.STRING)
    private ArticleFormat format;

    private String link;

    @Column(name = "stringrole")
    private String stringRole;

    @Column(name = "preview_photo_link")
    private String previewPhotoLink;

    // Связь для articles_star_history
    @ManyToMany
    @JoinTable(
            name = "articles_star_history",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> starredBy;
}