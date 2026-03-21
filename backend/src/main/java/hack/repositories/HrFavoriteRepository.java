// src/main/java/hack/repositories/HrFavoriteRepository.java
package hack.repositories;

import hack.models.HrFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HrFavoriteRepository extends JpaRepository<HrFavorite, Long> {
    List<HrFavorite> findByHrUserId(Long hrId);
    Optional<HrFavorite> findByHrUserIdAndStudentUserId(Long hrId, Long studentId);
}