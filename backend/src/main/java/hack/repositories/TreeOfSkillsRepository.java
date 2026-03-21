package hack.repositories;

import hack.models.TreeOfSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreeOfSkillsRepository extends JpaRepository<TreeOfSkills, Long> {
    // Вся сложная логика маппинга перенесена в HrController (Streams)
    // чтобы избежать крашей Hibernate при работе с коллекциями Map.
}