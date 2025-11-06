package mingeso.toolrent.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.ToolEntity;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    LoanEntity findFirstByToolOrderByLoanIdDesc(ToolEntity tool);

    List<LoanEntity> findByStatusNot(String status);

    @Query("""
        SELECT l.tool.name AS toolName,
               COUNT(l) AS loanCount
          FROM LoanEntity l
         GROUP BY l.tool.name
         ORDER BY COUNT(l) DESC
        """)
    List<ToolLoanSummaryProjection> findToolLoanSummary();

    interface ToolLoanSummaryProjection {
        String getToolName();
        Long getLoanCount();
    }
    // List<CategoryEntity> findByCategory(String category);
    // List<CategoryEntity> findBySalaryGreaterThan(int salary);
    // List<CategoryEntity> findByChildrenBetween(Integer startChildren, Integer endChildren);
    // @Query(value = "SELECT * FROM categories WHERE categories.rut = :rut", nativeQuery = true)
    // CategoryEntity findByRutNativeQuery(@Param("rut") String rut);
}
