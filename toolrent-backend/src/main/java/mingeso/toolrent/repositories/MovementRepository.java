package mingeso.toolrent.repositories;

import mingeso.toolrent.entities.MovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovementRepository extends JpaRepository<MovementEntity, Long> {
}
