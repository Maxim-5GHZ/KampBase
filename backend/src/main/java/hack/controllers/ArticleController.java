package hack.controllers;

import hack.models.Article;
import hack.models.User;
import hack.payload.ArticleRequest;
import hack.repositories.ArticleRepository;
import hack.repositories.UserRepository;
import hack.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleController(ArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    // ИСПРАВЛЕНИЕ: Убрали {"", "/"}, теперь Spring Boot 3 точно всё схавает корректно
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Статья не найдена"));
        }
        return ResponseEntity.ok(articleOpt.get());
    }
    // Добавление статьи
    @PostMapping
public ResponseEntity<?> createArticle(@RequestBody ArticleRequest request, 
                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    User user = userRepository.findById(userDetails.id()).orElseThrow();

    Article article = new Article();
    article.setTitle(request.getTitle());
    article.setAbout(request.getAbout());
    article.setFormat(request.getFormat());
    
    // В поле link теперь придет URL вида http://localhost:8080/uploads/abc-123.md
    article.setLink(request.getLink());
    article.setPreviewPhotoLink(request.getPreviewPhotoLink());
    
    article.setAuthorId(user.getUserId());
    article.setAuthor(user.getUsername());
    article.setStringRole(user.getRole().name());
    article.setStarCount(0L);

    return ResponseEntity.ok(articleRepository.save(article));
}

    // Редактирование статьи
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, 
                                           @RequestBody ArticleRequest request, 
                                           @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Необходима авторизация"));
        }

        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Статья не найдена"));
        }

        Article article = articleOpt.get();

        // Проверка прав: редактировать может только автор
        if (!article.getAuthorId().equals(userDetails.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "У вас нет прав на редактирование этой статьи"));
        }

        // Обновляем поля
        article.setTitle(request.getTitle());
        article.setAbout(request.getAbout());
        article.setFormat(request.getFormat());
        article.setLink(request.getLink());
        article.setPreviewPhotoLink(request.getPreviewPhotoLink());

        Article updatedArticle = articleRepository.save(article);
        return ResponseEntity.ok(updatedArticle);
    }

    // Удаление статьи
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id, 
                                           @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Необходима авторизация"));
        }

        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Статья не найдена"));
        }

        Article article = articleOpt.get();

        // Проверка прав: удалить может только автор
        if (!article.getAuthorId().equals(userDetails.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "У вас нет прав на удаление этой статьи"));
        }

        articleRepository.delete(article);
        return ResponseEntity.ok(Map.of("message", "Статья успешно удалена"));
    }

    // Поиск статей по названию
    @GetMapping("/search")
    public ResponseEntity<?> searchArticles(@RequestParam String title) {
        List<Article> articles = articleRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(articles);
    }
}