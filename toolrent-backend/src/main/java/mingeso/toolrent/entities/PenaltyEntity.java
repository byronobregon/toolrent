package mingeso.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "penalties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PenaltyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long penaltyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loan_id", nullable = false)
    @JsonIgnore
    private LoanEntity loan;

    @Column(nullable = false)
    private String concept;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer charge;
}
