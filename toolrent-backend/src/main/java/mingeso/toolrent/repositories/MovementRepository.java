package mingeso.toolrent.repositories;

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
          + "WHERE m.tool IS NOT NULL AND m.tool.category.category_id = :categoryId")
  List<MovementEntity> findByToolCategoryId(@Param("categoryId") Long categoryId);
}
