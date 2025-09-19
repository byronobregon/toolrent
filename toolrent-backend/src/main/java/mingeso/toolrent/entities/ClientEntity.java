package mingeso.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity {

    @Id
    @Column(unique = true, nullable = false)
    private String clientRut;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer activeLoans;
}
