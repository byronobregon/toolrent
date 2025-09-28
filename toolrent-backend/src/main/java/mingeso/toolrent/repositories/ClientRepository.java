package mingeso.toolrent.repositories;

import mingeso.toolrent.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, String> {
    Optional<ClientEntity> findByClientRut(String clientRut);

    List<ClientEntity> findByActiveLoansLessThan(Integer activeLoans);

    void deleteByClientRut(String clientRut);
    // List<ClientEntity> findByChildrenBetween(Integer startChildren, Integer endChildren);
    // @Query(value = "SELECT * FROM categories WHERE categories.rut = :rut", nativeQuery = true)
    // ClientEntity findByRutNativeQuery(@Param("rut") String rut);
}