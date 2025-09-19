package mingeso.toolrent.repositories;

import mingeso.toolrent.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, String> {
    ClientEntity findByClientRut(String clientRut);

    void deleteByClientRut(String clientRut);
    // List<ClientEntity> findBySalaryGreaterThan(int salary);
    // List<ClientEntity> findByChildrenBetween(Integer startChildren, Integer endChildren);
    // @Query(value = "SELECT * FROM categories WHERE categories.rut = :rut", nativeQuery = true)
    // ClientEntity findByRutNativeQuery(@Param("rut") String rut);
}