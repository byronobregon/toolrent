package mingeso.toolrent.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "tool_id", nullable = true)
    @JsonIgnore
    private ToolEntity tool;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "loan_id", nullable = true)
    @JsonIgnore
    private LoanEntity loan;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "loan_return_id", nullable = true)
    @JsonIgnore
    private LoanReturnEntity loanReturn;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "repair_id", nullable = true)
    @JsonIgnore
    private RepairEntity repair;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "penalty_id", nullable = true)
    @JsonIgnore
    private PenaltyEntity penalty;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private LocalDateTime date;

    @PrePersist
    private void setCreationDate() {
        if (date == null) {
            date = LocalDateTime.now();
        }
    }
}
