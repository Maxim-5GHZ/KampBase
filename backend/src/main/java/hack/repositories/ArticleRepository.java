package hack.repositories;

import hack.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByTitleContainingIgnoreCase(String title);
}