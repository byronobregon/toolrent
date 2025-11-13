package mingeso.toolrent.dtos;

import lombok.Data;

@Data
public class PendingPenaltySummaryDto {
    private String clientRut;
    private String clientName;
    private Integer pendingAmount;
    private Long pendingCount;
}
