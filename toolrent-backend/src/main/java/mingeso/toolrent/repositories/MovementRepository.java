package mingeso.toolrent.repositories;

import java.util.List;

import mingeso.toolrent.entities.MovementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovementRepository extends JpaRepository<MovementEntity, Long> {

  List<MovementEntity> findAllByOrderByMovementIdDesc();

  @Query(
      "SELECT m FROM MovementEntity m "
          + "WHERE m.tool IS NOT NULL AND m.tool.category.category_id = :categoryId "
          + "ORDER BY m.movementId DESC")
  List<MovementEntity> findByToolCategoryId(@Param("categoryId") Long categoryId);
}
