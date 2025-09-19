package mingeso.toolrent.repositories;

import mingeso.toolrent.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    // List<CategoryEntity> findByCategory(String category);
    // List<CategoryEntity> findBySalaryGreaterThan(int salary);
    // List<CategoryEntity> findByChildrenBetween(Integer startChildren, Integer endChildren);
    // @Query(value = "SELECT * FROM categories WHERE categories.rut = :rut", nativeQuery = true)
    // CategoryEntity findByRutNativeQuery(@Param("rut") String rut);
}