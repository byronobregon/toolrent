package mingeso.toolrent.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.entities.PenaltyEntity;

@Repository
public interface PenaltyRepository extends JpaRepository<PenaltyEntity, Long> {
    List<PenaltyEntity> findByStatus(String status);
    boolean existsByLoanClientAndStatus(ClientEntity client, String status);

    @Query("""
        SELECT p.loan.client.clientRut AS clientRut,
               p.loan.client.name AS clientName,
               COUNT(p) AS pendingCount
          FROM PenaltyEntity p
         WHERE p.status = :status
         GROUP BY p.loan.client.clientRut, p.loan.client.name
         ORDER BY COUNT(p) DESC
        """)
    List<ClientPenaltyProjection> findClientPenaltySummaryByStatus(@Param("status") String status);

    interface ClientPenaltyProjection {
        String getClientRut();
        String getClientName();
        Long getPendingCount();
    }
}
