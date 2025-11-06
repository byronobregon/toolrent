package mingeso.toolrent.repositories;

import java.time.LocalDateTime;
import java.util.List;

import mingeso.toolrent.entities.MovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovementRepository extends JpaRepository<MovementEntity, Long> {

  @Query(
      "SELECT m FROM MovementEntity m "
          + "LEFT JOIN m.tool t "
          + "LEFT JOIN t.category c "
          + "WHERE (:categoryId IS NULL OR c.category_id = :categoryId) "
          + "  AND m.date >= COALESCE(:startDate, m.date) "
          + "  AND m.date <= COALESCE(:endDate, m.date) "
          + "ORDER BY m.movementId DESC")
  List<MovementEntity> findByFilters(
      @Param("categoryId") Long categoryId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);
}
