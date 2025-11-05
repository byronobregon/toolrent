package mingeso.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long movementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tool_id")
    @JsonIgnore
    private ToolEntity tool;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id")
    @JsonIgnore
    private LoanEntity loan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_return_id")
    @JsonIgnore
    private LoanReturnEntity loanReturn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_id")
    @JsonIgnore
    private RepairEntity repair;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penalty_id")
    @JsonIgnore
    private PenaltyEntity penalty;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer amount;
}
