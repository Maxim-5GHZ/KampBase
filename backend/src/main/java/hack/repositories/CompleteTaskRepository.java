// src/main/java/hack/repositories/CompleteTaskRepository.java
package hack.repositories;

import hack.models.CompleteTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompleteTaskRepository extends JpaRepository<CompleteTask, Long> {
    List<CompleteTask> findByTaskAuthorUserIdAndStatus(Long mentorId, hack.enums.SolutionStatus status);
    
    // ДОБАВЛЕНО: поиск всех решений для конкретной задачи
    List<CompleteTask> findByTaskId(Long taskId);
}